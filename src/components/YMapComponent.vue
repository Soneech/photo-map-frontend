<script setup lang="ts">
    import { ref, computed } from 'vue'
    import { useAuthStore } from '@/stores/auth';
    import { RouterLink } from 'vue-router';

    import {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapListener,
        YMapMarker,
        YMapClusterer,
        clusterByGrid,
        YMapControl, 
        YMapControls,
    } from '../lib/ymaps'

    import { 
        useMapEventTracker
    } from '../lib/useMapEventTracker';
    import router from '@/router';

    import { 
        categoriesVisible, 
        showOnlyMyMarks,
        showUserMarks,
        selectedUserId
    } from '../lib/categoriesViewLogic'

    import { LOCATION } from '../lib/variables'

    const auth = useAuthStore();
    const authUserId = localStorage.getItem('id')

    const mapEntity = ref<any>(null)
    function refMap(el: { entity: any } | null) {
        mapEntity.value = el?.entity ?? null
    }

    const {
        clickEventHandler,
        dblClickEventHandler,
        createBehaviorHandler,
        createDomEventHandler,
    } = useMapEventTracker()

    interface Mark {
       id: BigInt,
       authorId: BigInt,
       latitude: number,
       longitude: number,
       name: string,
       categoryId: bigint,
       isPrivate: boolean,
    }

    const markers = ref<Mark[]>([]);

    async function getAllMarks() {
        const response = await fetch("http://localhost:8080/marks/main", {
            method: "GET"
        });

        if (response.status == 200) {
            const data: Mark[] = await response.json();
            markers.value = data;
        }
        console.log(markers.value)
    }

    getAllMarks()


    interface Category {
        id: bigint,
        name: string,
    }
    const categories = ref<Category[]>(null)
    const selectedCategoryIds = ref<bigint[]>([])

    async function getCategories() {
        const response = await fetch("http://localhost:8080/categories", {
            method: "GET",
        });

        const data = await response.json() as Array<Category>
        categories.value = data
    }
    getCategories()

    const filteredMarkers = computed<Mark[]>(() => {
        let result = markers.value

        result = result.filter(mark =>
            mark.isPrivate == false || 
            mark.authorId.toString() == authUserId
        )

        if (selectedCategoryIds.value.length > 0) {
            result = result.filter(mark =>
                selectedCategoryIds.value.includes(mark.categoryId)
            );
        }

        if (showOnlyMyMarks.value) {
            result = result.filter(mark =>
                mark.authorId.toString() == authUserId
            );
        }

        if (showUserMarks.value) {
            result = result.filter(mark =>
                mark.authorId.toString() == selectedUserId.value
            )
        }

        return result;
    });


    const gridSizedMethod = clusterByGrid({gridSize: 72});

    const clusterFeatures = computed(() =>
        filteredMarkers.value.map((mark) => ({
            type: 'Feature',
            id: mark.id,
            geometry: {
                type: 'Point',
                coordinates: [mark.latitude, mark.longitude]
            },
            properties: {
                name: mark.name
            },
            object: mark
        }))
    );

    var suppressClick = false;
    const previewVisible = ref(false);
    const previewMarkers = ref<Mark[]>([]);

    function onClusterClick(features: any[]) {
        suppressClick = true
        previewVisible.value = true
        previewMarkers.value = features.map((feature) => feature.object)
    }

    function onMarkClick(feature: any) {
        suppressClick = true
        router.push("/marks/" + feature.id)
    }

    function closePreview() {
        previewVisible.value = false
    }

</script>

<template>
    <YMap :location="LOCATION" :behaviors="['scrollZoom', 'drag']" :ref="refMap">
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        <YMapListener
            @click="(_: any, event: object) => {
                if (suppressClick) {
                    suppressClick = false;
                    return;
                }
                clickEventHandler(event, true);
            }"
            @dblClick="(_: any, event: object) => dblClickEventHandler(event)"

            @mouseMove="(_: any, event: object) => createDomEventHandler('mouseMove', event)"
            @mouseEnter="(_: any, event: object) => createDomEventHandler('mouseEnter', event)"
            @mouseLeave="(_: any, event: object) => createDomEventHandler('mouseLeave', event)"
            @mouseDown="(_: any, event: object) => createDomEventHandler('mouseDown', event)"

            @actionStart="(obj: object) => createBehaviorHandler(obj, true)"
            @actionEnd="(obj: object) => createBehaviorHandler(obj, false)"
        />
        
        <YMapClusterer
            :features="clusterFeatures"
            :method="gridSizedMethod"
        >
            <template #marker="{ feature }">
                <YMapMarker
                    :key="feature.id"
                    :coordinates="feature.geometry.coordinates"
                    @click="onMarkClick(feature)"
                >
                <div class="marker-circle"></div>
                </YMapMarker>
            </template>

            <template #cluster="{ coordinates, features }">
                <YMapMarker
                    :key="features[0].id + '-' + features.length"
                    :coordinates="coordinates"
                    @click="onClusterClick(features)"
                >
                    <div class="cluster-circle">
                        <span class="cluster-text">{{ features.length }}</span>
                    </div>
                </YMapMarker>
            </template>
        </YMapClusterer>

    </YMap>

    <div :class="{ 'modal': true, 'visible': previewVisible, 'preview-modal': true }">
        <button @click="closePreview" class="close-form-btn">✖</button>
        <div>
            <p>Предпросмотр меток</p>
            <div class="marks-preview-list">
                <div class="mark-preview-item"
                    v-for="mark in previewMarkers" 
                    :key="mark.id.toString()">
                    <RouterLink :to="{name: 'MarkPage', params: {id: mark.id.toString()}}">
                        <p class="mark-name-preview">{{ mark.name }}></p>
                    </RouterLink>
                </div>
            </div>
        </div> 
    </div>
    <div class="overlay" :class="{ 'visible': previewVisible }"></div>

    <div class="categories-list fade-block" :class="{visible: categoriesVisible}">
        <div
            v-for="category in categories"
            :key="category.id.toString()"
            class="category-item"
        >
            <label>
                <input
                    type="checkbox"
                    class="category-checkbox"
                    :value="category.id"
                    v-model="selectedCategoryIds"
                />
                <span class="category-checkbox-name">{{ category.name }}</span>
            </label>
        </div>
    </div>
</template>
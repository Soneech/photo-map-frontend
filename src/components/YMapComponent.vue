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
        clusterByGrid
    } from '../lib/ymaps'

    import { 
        useMapEventTracker
    } from '../lib/useMapEventTracker';
    import router from '@/router';

    const LOCATION = {
        center: [37.588144, 55.733842],
        zoom: 10
    }

    const auth = useAuthStore();

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
       latitude: number,
       longitude: number,
       name: string 
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
    }

    getAllMarks();

    const gridSizedMethod = clusterByGrid({gridSize: 72});

    const clusterFeatures = computed(() =>
        markers.value.map((mark) => ({
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

        console.log('Клик по кластеру. Внутри:', features)
    }

    function onMarkClick(feature: any) {
        suppressClick = true
        console.log('Клик по метке. Внутри:', feature)

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
</template>
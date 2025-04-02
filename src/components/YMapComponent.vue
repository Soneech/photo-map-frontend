<script setup lang="ts">
    import { ref } from 'vue'

    import {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapListener,
        YMapMarker
    } from '../lib/ymaps'

    import { 
        setMapRef,
        useMapEventTracker, 
        markers, 
    } from '../lib/useMapEventTracker';

    const LOCATION = {
        center: [37.588144, 55.733842],
        zoom: 10
    }

    const mapRef = ref()
    setMapRef(mapRef)

    const {
        clickEventHandler,
        dblClickEventHandler,
        createBehaviorHandler,
        createDomEventHandler,
    } = useMapEventTracker()
</script>

<template>
    <YMap :location="LOCATION" :behaviors="['scrollZoom', 'drag']" :ref="mapRef">
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        <YMapListener
        @click="(_: any, event: object) => clickEventHandler(event)"
        @dblClick="(_: any, event: object) => dblClickEventHandler(event)"

        @mouseMove="(_: any, event: object) => createDomEventHandler('mouseMove', event)"
        @mouseEnter="(_: any, event: object) => createDomEventHandler('mouseEnter', event)"
        @mouseLeave="(_: any, event: object) => createDomEventHandler('mouseLeave', event)"
        @mouseDown="(_: any, event: object) => createDomEventHandler('mouseDown', event)"

        @actionStart="(obj: object) => createBehaviorHandler(obj, true)"
        @actionEnd="(obj: object) => createBehaviorHandler(obj, false)"
        />

        <YMapMarker
            v-for="(coord, index) in markers"
            :key="index"
            :coordinates="coord">
            <div style="width: 14px; height: 14px; background: green; border-radius: 50%"></div>
        </YMapMarker>
    </YMap>
</template>
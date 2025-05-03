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
        markCoords,
    } from '../lib/useMapEventTracker';

    const LOCATION = {
        center: markCoords.value,
        zoom: 15
    }

    const mapRef = ref()
    setMapRef(mapRef)

    const {
        clickEventHandler,
        createBehaviorHandler,
        createDomEventHandler,
    } = useMapEventTracker()
</script>

<template>
    <YMap :location="LOCATION" :behaviors="['scrollZoom', 'drag']" :ref="mapRef">
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        <YMapListener
        @click="(_: any, event: object) => clickEventHandler(event, false)"

        @mouseMove="(_: any, event: object) => createDomEventHandler('mouseMove', event)"
        @mouseEnter="(_: any, event: object) => createDomEventHandler('mouseEnter', event)"
        @mouseLeave="(_: any, event: object) => createDomEventHandler('mouseLeave', event)"
        @mouseDown="(_: any, event: object) => createDomEventHandler('mouseDown', event)"

        @actionStart="(obj: object) => createBehaviorHandler(obj, true)"
        @actionEnd="(obj: object) => createBehaviorHandler(obj, false)"
        />
        
        <div>
            <YMapMarker :coordinates="markCoords">
                <div class="marker-circle"></div>
            </YMapMarker>
        </div>
    </YMap>
</template>
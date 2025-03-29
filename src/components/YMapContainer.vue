<script lang="ts" setup>
    import {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker} from '../lib/ymaps';
    import type {YMapLocationRequest} from 'ymaps3';

    const LOCATION: YMapLocationRequest = {
        center: [37.588144, 55.733842],
        zoom: 9
    };
</script>

<template>
    <div class="map-container" style="width: 90%; height: 78vh; margin: auto;">
        <YMap :location="LOCATION">

        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />

        </YMap>
    </div>
</template>
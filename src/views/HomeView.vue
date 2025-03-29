<script lang="ts" setup>
    import {YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker} from '../lib/ymaps';
    import type {YMapLocationRequest} from 'ymaps3';

    const LOCATION: YMapLocationRequest = {
        center: [37.588144, 55.733842],
        zoom: 9
    };
</script>

<template>
    <div class="main-content">
        <div class="greeting-container">
            <h2>Добро пожаловать!</h2>
            <p>На Нашем сайте Вы можете просматривать метки с фотографиями на карте, а также становиться автором!</p>
            <div class="links-btns">
                <RouterLink to="/marks">Все метки списком</RouterLink>
            </div>
            
            <div id="map" style="width: 600px; height: 400px">

            </div>
        </div>

        <div class="map-container" style="width: 600px; height: 400px">
            <YMap :location="LOCATION">
            <YMapDefaultSchemeLayer />
            <YMapDefaultFeaturesLayer />

            <YMapMarker :coordinates="[37.588144, 55.733842]" :draggable="true">
                <section>
                <h1>You can drag this header</h1>
                </section>
            </YMapMarker>
            </YMap>
        </div>
    </div>
</template>
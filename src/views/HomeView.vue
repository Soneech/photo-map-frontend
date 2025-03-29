<script lang="ts" setup>
    import type {YMapLocationRequest} from 'ymaps3';

    async function waitForYmaps3(): Promise<any> {
        return new Promise((resolve) => {
            const check = () => {
                if ((window as any).ymaps3) {
                    resolve((window as any).ymaps3);
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        });
    }

    async function initMap(): Promise<void> {
        const ymaps3 = await waitForYmaps3();

        await ymaps3.ready;

        const LOCATION: YMapLocationRequest = {
            center: [37.588144, 55.733842],
            zoom: 9
        };

        const { YMap, YMapDefaultSchemeLayer } = ymaps3;

        const map = new YMap(document.getElementById('map'), { location: LOCATION });
        map.addChild(new YMapDefaultSchemeLayer({}));
    }

    initMap();
    ymaps3.strictMode = true;
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
            <div id="map" class="map">

            </div>
        </div>
    </div>
</template>
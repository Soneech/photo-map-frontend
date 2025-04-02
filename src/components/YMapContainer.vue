<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import YMapComponent from './YMapComponent.vue';

import {   
    isFromVisible,
    closeFormWindow 
} from '../lib/useMapEventTracker';
</script>

<template>
    <div>
        <div>
            <div :class="{ 'modal': true, 'visible': isFromVisible }" class="mark-modal">
                <button @click="closeFormWindow" class="close-form-btn">✖</button>

                <div>
                    <p>Хотите создать метку?</p>
                    <div class="mark-form-btns">
                        <RouterLink to="/marks/create"><button @click="closeFormWindow">Да</button></RouterLink>
                        <button @click="closeFormWindow">Нет</button>
                    </div>
                </div> 
            </div>
            <div class="overlay" :class="{ 'visible': isFromVisible }"></div>
        </div>

        <div class="map-container" style="width: 100%; height: 100vh; margin: auto;">
            <YMapComponent></YMapComponent>
        </div>
    </div>

</template>

<script lang="ts" setup>
    import { RouterLink } from 'vue-router';
    import YMapContainer from '../components/YMapContainer.vue'
</script>

<template>
    <div class="main-content">
        <div class="greeting-container">
            <h2>Добро пожаловать!</h2>
            <p>На Нашем сайте Вы можете просматривать метки с фотографиями на карте, а также становиться автором!</p>
            <div class="links-btns">
                <RouterLink to="/marks">Все метки списком</RouterLink>
            </div>
        </div>

        <YMapContainer/>
    </div>
</template>
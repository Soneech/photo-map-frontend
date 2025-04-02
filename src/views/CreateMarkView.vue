<script lang="ts" setup>
    import YMapComponent from '@/components/YMapComponent.vue';
    import CreateMarkForm from '@/components/CreateMarkForm.vue';

    import { useAuthStore } from '../stores/auth';
    import { ref } from 'vue';

    const auth = useAuthStore();
    const token = auth.token;
</script>

<template>
    <div class="main-content">
        <div class="map-container" style="width: 100%; height: 43vh; margin: auto; box-shadow: 0 0 11px #0f0a051a;">
            <YMapComponent></YMapComponent>
        </div>
        <div>
            <CreateMarkForm></CreateMarkForm>
        </div>
    </div> 
</template>
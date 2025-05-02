<script lang="ts" setup>
    import YMapFormComponent from '@/components/YMapFormComponent.vue';
    import CreateMarkForm from '@/components/CreateMarkForm.vue';

    import { useAuthStore } from '../stores/auth';

    const auth = useAuthStore();
    const token = auth.token;
</script>

<template>
    <div class="main-content">
        <div class="map-container" style="width: 100%; height: 43vh; margin: auto; box-shadow: 0 0 11px #0f0a051a;">
            <YMapFormComponent></YMapFormComponent>
        </div>
        <div>
            <CreateMarkForm></CreateMarkForm>
        </div>
    </div> 
</template>
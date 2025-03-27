<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { ref } from 'vue';

    const user = {
        name: '',
        password: ''
    }

    const isModalVisible = ref(false);

    async function onSubmit() {
        await useAuthStore().login(user.name, user.password);
        
        if (useAuthStore().loginStatus != 200) {
            openModalWindow();
        }
    }

    function openModalWindow() {
        if (useAuthStore().loginStatus == 400) {
            isModalVisible.value = true;
        }
    }

    function closeModalWindow() {
        isModalVisible.value = false;
    }
</script>

<template>
    <form @submit.prevent="onSubmit" class="auth-form">
        <h2 class="form-title">Введите данные аккаунта</h2>

        <input type="text" id="name" class="form-input" placeholder="Логин" v-model="user.name">
        <input type="password" id="password" class="form-input" placeholder="Пароль" v-model="user.password">

        <button type="submit" class="default-button form-button">Войти</button>
    </form>

    <div :class="{ 'modal': true, 'visible': isModalVisible }">
        <button @click="closeModalWindow">✖</button>
        <p v-if="useAuthStore().loginStatus == 400" v-for="message in useAuthStore().loginErrors.messages">{{ message }}</p>
    </div>

    <div class="overlay" :class="{ 'visible': isModalVisible }"></div>
</template>
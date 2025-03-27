<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

    const user = {
        name: '',
        email: '', 
        password: ''
    }

    const isModalVisible = ref(false);

    async function onSubmit() {
        await useAuthStore().registration(user.name, user.email, user.password);
        if (useAuthStore().registrationStatus == 400) {
            openModalWindow();
        }
    }

    function openModalWindow() {
        isModalVisible.value = true;
    }

    function closeModalWindow() {
        isModalVisible.value = false;
    }

</script>

<template>
    <form @submit.prevent="onSubmit" class="auth-form">
        <h2 class="form-title">Введите данные аккаунта</h2>

        <input type="text" id="name" class="form-input" placeholder="Логин" v-model="user.name">
        <input type="text" id="email" class="form-input" placeholder="Почта" v-model="user.email">
        <input type="password" id="password" class="form-input" placeholder="Пароль" v-model="user.password">

        <button type="submit" class="default-button form-button sign-up-form-btn">Зарегистрироваться</button>
    </form>

    <div :class="{ 'modal': true, 'visible': isModalVisible }">
        <button @click="closeModalWindow">✖</button>
        <p v-if="useAuthStore().registrationStatus == 400" v-for="message in useAuthStore().fieldsErrors.messages">{{ message }}</p>
    </div>

    <div class="overlay" :class="{ 'visible': isModalVisible }"></div>
</template>
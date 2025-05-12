<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';

    const user = {
        name: '',
        password: ''
    }

    const isModalVisible = ref(false);
    const auth = useAuthStore();

    async function onSubmit() {
        await auth.login(user.name, user.password);
        
        if (auth.loginStatus != 200) {
            openModalWindow();
        }
    }

    function openModalWindow() {
        if (auth.loginStatus == 400 || auth.loginStatus == 401 || auth.loginStatus == 404) {
            isModalVisible.value = true;
        }
    }

    function closeModalWindow() {
        isModalVisible.value = false;
    }
</script>

<template>
    <div class="auth-block">
        <form @submit.prevent="onSubmit" class="auth-form">
        <h2 class="form-title">Введите данные аккаунта</h2>

        <input type="text" id="name" class="form-input" placeholder="Логин" v-model="user.name">
        <input type="password" id="password" class="form-input" placeholder="Пароль" v-model="user.password">

        <p>Ещё нет аккаунта? 
            <RouterLink to="/auth/registration" style="text-decoration: underline; margin: auto;">Зарегистрироваться</RouterLink>
        </p>

        <button type="submit" class="default-button form-button">Войти</button>
        </form>

        <div :class="{ 'modal': true, 'visible': isModalVisible }">
            <button @click="closeModalWindow" class="close-form-btn">✖</button>
            <p v-if="useAuthStore().loginStatus == 400" v-for="message in useAuthStore().errors">{{ message }}</p>
            <p v-if="useAuthStore().loginStatus == 401">{{ auth.message }}</p>
            <p v-if="useAuthStore().loginStatus == 404">Неверная почта или пароль</p>
        </div>

        <div class="overlay" :class="{ 'visible': isModalVisible }"></div>
    </div>
    
</template>
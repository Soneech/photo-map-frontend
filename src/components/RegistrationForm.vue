<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth';
    import { ref } from 'vue';

    const user = {
        name: '',
        email: '', 
        password: ''
    }

    const isModalVisible = ref(false);
    const auth = useAuthStore();

    async function onSubmit() {
        await auth.registration(user.name, user.email, user.password);
        if (auth.registrationStatus == 400 || auth.registrationStatus == 409) {
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
    <div class="auth-block">
        <form @submit.prevent="onSubmit" class="auth-form">
        <h2 class="form-title">Введите данные аккаунта</h2>

        <input type="text" id="name" class="form-input" placeholder="Логин" v-model="user.name">
        <input type="text" id="email" class="form-input" placeholder="Почта" v-model="user.email">
        <input type="password" id="password" class="form-input" placeholder="Пароль" v-model="user.password">
        
        <p>Уже есть акканут?
            <RouterLink to="/auth/login" style="text-decoration: underline; margin: auto;">Войти</RouterLink>
        </p>

        <button type="submit" class="default-button form-button sign-up-form-btn">Зарегистрироваться</button>
        </form>

        <div :class="{ 'modal': true, 'visible': isModalVisible }">
            <button @click="closeModalWindow">✖</button>
            <p v-if="auth.registrationStatus == 400" v-for="message in auth.errors">{{ message }}</p>
            <p v-if="auth.registrationStatus == 409">{{ auth.message }}</p>
        </div>

        <div class="overlay" :class="{ 'visible': isModalVisible }"></div>
    </div>
    
</template>
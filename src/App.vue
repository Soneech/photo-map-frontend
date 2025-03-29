<script lang="ts" setup>
    import { RouterLink, RouterView } from 'vue-router';
    import { useAuthStore } from './stores/auth';

    const auth = useAuthStore();

    function logout() {
        auth.logout();
    }

</script>

<template>
    <header>
        <div class="header-container">
            <h1 class="logo-text"><RouterLink to="/">Фото Карточка</RouterLink></h1>
            <div class="navigation">
                <ul>
                    <li v-if="auth.isLoggedIn">
                        <a href="#" @click="logout" class="header-button" id="logout-btn">Выйти</a>
                    </li>
                    <div v-else>
                        <li>
                            <RouterLink to="/auth/login" class="header-button" id="sign-in-btn">Войти</RouterLink>
                        </li>
                        <li>
                            <RouterLink to="/auth/registration" class="header-button" id="sign-up-btn">Зарегистрироваться</RouterLink>
                        </li>
                    </div>
                    
                </ul>
            </div>
        </div>
    </header>

    <div class="wrapper">
        <RouterView/>

        <footer>
            <div class="footer-container">
                <a href="https://vk.com/soneech" class="footer-link" id="sign-in-btn">VK</a>
                <a href="https://github.com/Soneech" class="footer-link" id="sign-up-btn">GitHub</a>
                <a href="https://telegram.me/sonechous" class="footer-link" id="logout-btn">Telegram</a>
            </div>
        </footer>
    </div>
</template>

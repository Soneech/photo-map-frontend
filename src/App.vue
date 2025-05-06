<script lang="ts" setup>
    import { RouterLink, RouterView } from 'vue-router';
    import { useAuthStore } from './stores/auth';

    const auth = useAuthStore();

</script>

<template>
    <div class="wrapper">
        <header>
            <div class="header-container">
                <div class="main-links">
                    <h1 class="logo-text"><RouterLink to="/">Фото Карточка</RouterLink></h1>
                    <p class="header-link"><RouterLink to="">Категории</RouterLink></p>
                    <p class="header-link"><RouterLink to="">Пользователи</RouterLink></p>
                </div>
                <div class="navigation">
                    <div>
                        <div v-if="auth.isLoggedIn" class="main-links">
                            <p class="header-link">
                                <RouterLink 
                                    :to="{name: 'ProfilePage', params: {id: auth.id}}"
                                    class="header-link profile-link">Профиль</RouterLink>
                            </p>
                        </div>
                        <div v-else class="main-links auth-links">
                            <div>
                                <p class="header-link"><RouterLink to="/auth/login" id="sign-in-btn">Войти</RouterLink></p>
                            </div>
                            <div>
                                <p class="header-link"><RouterLink to="/auth/registration" class="header-link" id="sign-up-btn">Зарегистрироваться</RouterLink></p>
                            </div>
                        </div>  
                    </div>
                </div>
            </div>
        </header>

        <div class="main">
            <RouterView/>
        </div>
        

        <footer>
            <div class="footer-container">
                <a href="https://vk.com/soneech" class="footer-link" id="sign-in-btn">VK</a>
                <a href="https://github.com/Soneech" class="footer-link" id="sign-up-btn">GitHub</a>
                <a href="https://telegram.me/sonechous" class="footer-link" id="logout-btn">Telegram</a>
            </div>
        </footer>
    </div>
</template>

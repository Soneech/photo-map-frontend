<script lang="ts" setup>
    import { useAuthStore } from '@/stores/auth'
    import { useRoute, RouterLink } from 'vue-router'
    import { ref } from 'vue'
    import { onMounted } from 'vue'

    const auth = useAuthStore()

    const route = useRoute()
    const userId = route.params.id

    const storageUserId = localStorage.getItem('id')

    function logout() {
        auth.logout()
    }

    interface User {
        id: BigInt,
        name: string,
        email: string,
        role: string,
    }

    const user = ref<User | null>(null)

    async function getUserInfo() {
        const response = await fetch("http://localhost:8080/users/" + userId, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${auth.token}`,
        }})

        const raw = await response.json() as {
            id: BigInt
            name: string
            email: string
            role: string
        }

        console.log(raw)

        user.value = {
            id: raw.id,
            name: raw.name,
            email: raw.email,
            role: raw.role
        }
    }

    getUserInfo()

    function currentOrAdminUser() {
        return userId == storageUserId || user.value.role == 'ROLE_ADMIN'
    }

</script>

<template>
    <div class="profile-page">
        <div style="height: 90px;"></div>
        <div v-if="!user"></div>
        <div v-else class="profile-block">
            <div class="profile-info">
                <div>
                    <img class="profile-image" src="../assets/image/profile.png">
                </div>
                
                <div class="data">
                    <p>{{ user.name }}</p>
                    <p v-if="currentOrAdminUser()">{{ user.email }}</p>
                    <p v-if="currentOrAdminUser">
                        <span v-if="user.role == 'ROLE_ADMIN'">Администратор</span>
                        <span v-if="user.role == 'ROLE_USER'">Обычный пользователь</span>
                    </p>
                    <p><RouterLink to="">Метки</RouterLink></p>
                </div>
            </div>
            
            <!--
            <button class="default-button form-button"><RouterLink to="">Редактировать</RouterLink></button>
            -->

            <button v-if="userId == storageUserId" class="default-button form-button" @click="logout">Выйти</button>
        </div>
    </div>

    <div style="height: 8vh;"></div>
</template>
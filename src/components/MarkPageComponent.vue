<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { RouterLink, useRoute } from 'vue-router'
    import { useAuthStore } from '@/stores/auth'
    import router from '@/router'
    import {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker
    } from '../lib/ymaps'
    import { setMapRef } from '../lib/useMapEventTracker'

    const auth = useAuthStore()

    const mapRef = ref()
    setMapRef(mapRef)

    const route = useRoute()
    const markId = route.params.id

    const authUserId = localStorage.getItem('id')

    declare const URL: typeof window.URL

    function getObjectURL(file: any): string {
        return URL.createObjectURL(file)
    }

    interface Mark {
       id: BigInt,
       authorId: BigInt,
       authorName: String,
       latitude: number,
       longitude: number,
       name: string,
       description: string,
       likes: BigInt,
       createdAt: string,
       updatedAt: string,
    }

    const mark       = ref<Mark | null>(null)
    const videos     = ref<Blob[]>([])
    const photos     = ref<Blob[]>([])
    const loading    = ref(false)
    const error      = ref<string | null>(null)

    loading.value = true
    error.value   = null
    
    async function getMarkFullInfo() {
        try {
            const response = await fetch("http://localhost:8080/marks/" + markId, {
                method: 'GET'
            })

            console.log('response received')

            const formData = await response.formData()
            console.log('formData: ', formData)

            const metaPart = formData.get('metadata')
            mark.value = JSON.parse(metaPart) as Mark

            videos.value = formData.getAll('videos')
                .filter((f): f is Blob => f instanceof Blob)

            photos.value = formData.getAll('photos')
                .filter((f): f is Blob => f instanceof Blob)
            
            console.log(mark.value)
            console.log(videos.value)
            console.log(photos.value)
        }
        catch (err: any) {
            console.error(err)
            error.value = err.message || 'Unknown error'
        }
        finally {
            loading.value = false
            console.log(mark.value)
        }
    }

    onMounted(getMarkFullInfo)


    interface Like {
        userId: bigint
        markId: bigint
    }

    const likes = ref<Like[]>([])
    var likesCount = 0

    const liked = ref(false)

    function handleLike() {
        liked.value = !liked.value
        if (liked.value) likesCount++
        else likesCount--
    }

    async function getLikes() {
        const response = await fetch("http://localhost:8080/likes/" + markId, {
            method: 'GET'
        })

        type RawLike = { userId: number | string; markId: number | string }
        const data = await response.json() as RawLike[]

        likesCount = data.length
        
        const foundUserId = data.find(item =>
            item.userId == authUserId
        )
        if (foundUserId) {
            liked.value = true
        }
    }

    getLikes()

    async function addOrDeleLike() {
        const response = await fetch("http://localhost:8080/likes/" + markId, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${auth.token}`,
            }
        })

        if (response.status == 401 || response.status == 405) {
            router.push("/auth/login")
        }

        if (response.status == 200) {
            handleLike()
        }
    }
    
</script>

<template>
    <div v-if="loading">
    </div>

    <div v-else-if="mark">
        <div class="map-container" style="width: 100%; height: 43vh; margin: auto; box-shadow: 0 0 11px #0f0a051a;">
            <YMap 
                :location="{
                    center: [mark.latitude, mark.longitude],
                    zoom: 15
                }" 
                :behaviors="['scrollZoom', 'drag']" :ref="mapRef">
                <YMapDefaultSchemeLayer />
                <YMapDefaultFeaturesLayer />

                <div>
                    <YMapMarker :coordinates="[mark.latitude, mark.longitude]">
                        <div class="marker-circle"></div>
                    </YMapMarker>
                </div>
            </YMap>
        </div>

        <div class="mark-block">
            <h3 class="mark-title">{{ mark.name }}</h3>
            <RouterLink :to="{name: 'ProfilePage', params: {id: mark.authorId.toString()}}">
                <p>Автор <span style="text-decoration: underline;">{{ mark.authorName }}</span></p>
            </RouterLink>
            <p>{{ mark.description }}</p>
            
            <div class="files-block">
                <div v-if="photos.length === 0"></div>

                <div v-else class="photos-block">
                    <p>Фотографии</p>
                    <div class="mark-previews photos">
                        <div class="preview-item mark-file" v-for="(photo, index) in photos" :key="index">
                            <img 
                                :src="getObjectURL(photo)" 
                                controls
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="files-block">
                <div v-if="videos.length === 0"></div>

                <div v-else class="videos-block">
                    <p>Видео</p>
                    <div class="mark-previews videos">
                        <div class="preview-item mark-file" v-for="(video, index) in videos" :key="index">
                            <video 
                                :src="getObjectURL(video)" 
                                controls
                                >
                            </video>
                        </div>
                    </div>
                </div>
                <div style="height: 3vh;"></div>
                <div class="likes-block">
                    <div class="heart" :class="{ liked }" @click="addOrDeleLike"></div>
                    <div class="likes-value">
                        <span v-if="!likes"></span>
                        <span v-else>{{ likesCount }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div style="height: 10vh">
    </div>
</template>
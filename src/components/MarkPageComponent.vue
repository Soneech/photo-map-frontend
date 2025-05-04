<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import {
        YMap,
        YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer,
        YMapMarker
    } from '../lib/ymaps'
    import { setMapRef } from '../lib/useMapEventTracker'

    const mapRef = ref()
    setMapRef(mapRef)

    const route = useRoute();
    const markId = route.params.id;

    declare const URL: typeof window.URL;

    function getObjectURL(file: any): string {
        return URL.createObjectURL(file)
    }

    interface Mark {
       id: BigInt,
       latitude: number,
       longitude: number,
       name: string,
       description: string,
       likes: BigInt,
       createdAt: string,
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

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`)
            }
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
        }
    }

    onMounted(getMarkFullInfo)
    
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
            <h2>{{ mark.name }}</h2>
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
            </div>
        </div>
    </div>

    <div style="height: 10vh">
    </div>
</template>
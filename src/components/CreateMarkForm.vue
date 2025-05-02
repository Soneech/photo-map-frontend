<script lang="ts" setup>
    import { ref } from 'vue';
    import { 
        markCoords
    } from '../lib/useMapEventTracker';
    import { useAuthStore } from '@/stores/auth';
    import router from '@/router';

    declare const URL: typeof window.URL;

    var errors: string[] = [];

    var isModalVisible = ref(false);
    var isErrorModalVisible = ref(false);

    const openModalWindow = () => {
        isModalVisible.value = true;
    };
    const openErrorModalWindow = () => {
        isErrorModalVisible.value = true;
    };
    const closeModalWindow = () => {
        isModalVisible.value = false;
        isErrorModalVisible.value = false;
        errors = [];
    }

    interface Mark {
        latitude: number,
        longitude: number,
        name: string,
        description: string
    }

    interface Files {
        photos: File[],
        videos: File[]
    }

    const auth = useAuthStore();

    const mark = ref<Mark>({
        name: '',
        description: '',
        latitude: markCoords.value[0],
        longitude: markCoords.value[1],
    })

    const markFiles = ref<Files>({
        photos: [],
        videos: []
    })

    function handlePhotoUpload(event: Event) {
        const files = (event.target as HTMLInputElement).files
        if (!files) return

        const fileArray = Array.from(files)
        const total = markFiles.value.photos.length + fileArray.length

        if (total > 10) {
            alert('Можно загрузить не более 10 фотографий')
            return
        }

        markFiles.value.photos.push(...fileArray)
    }

    function handleVideoUpload(event: Event) {
        const files = (event.target as HTMLInputElement).files
        if (!files) return

        const fileArray = Array.from(files)
        const total = markFiles.value.videos.length + fileArray.length

        if (total > 3) {
            alert('Можно загрузить не более 3 видеофайлов')
            return
        }

        markFiles.value.videos.push(...fileArray)
    }

    function getObjectURL(file: File): string {
        return URL.createObjectURL(file)
    }

    async function createMark() {
        const formData = new FormData();
        mark.value.latitude = markCoords.value[0];
        mark.value.longitude = markCoords.value[1];
    
        formData.append("mark", new Blob([JSON.stringify(mark.value)], { type: "application/json" }));
    
        markFiles.value.photos.forEach(photo => formData.append("photos", photo));
        markFiles.value.videos.forEach(video => formData.append("videos", video));
    
        const response = await fetch("http://localhost:8080/marks/create", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${auth.token}`,
        },
        body: formData
        });
        
        if (!response.ok) {
            const errorResponse = await response.json();
            console.log(errorResponse);

            if (errorResponse.status == '401') {
                router.push("/auth/login");
            }
            else {
                errors = errorResponse.errors;
                console.log(errors);
                openErrorModalWindow();
                return;
            }
        }
    
        const result = await response.json();
        openModalWindow();

        return result;
    }

    function onSubmit() {
        console.log(mark);
        console.log(markFiles);
        createMark();
    }

</script>

<template>
    <div class="create-mark-form-block">
        <form @submit.prevent="onSubmit" class="create-mark-form">
            <input type="text" id="name" class="form-input" placeholder="Название" v-model="mark.name">
            <textarea class="mark-note" placeholder="Ваша заметка" v-model="mark.description"></textarea>
            
            <div class="load-files-block">
                <div class="load-photo-block">
                    <div>
                        <label>Загрузите фотографии (до 10)</label>
                        <label for="photo-upload" class="file-upload-button">
                            Выбрать файлы
                        </label>
                        <input id="photo-upload" type="file" accept="image/*" multiple @change="handlePhotoUpload"/>
                    </div>

                    <div class="previews">
                        <div class="preview-item" v-for="(file, index) in markFiles.photos" :key="index">
                            <img :src="getObjectURL(file)" alt="preview"/>
                        </div>
                    </div>
                </div>
                
                <div class="load-video-block">
                    <div>
                        <label>Загрузите видео (до 3)</label>
                        <label for="video-upload" class="file-upload-button">
                            Выбрать файлы
                        </label>
                        <input id="video-upload" type="file" accept="video/*" multiple @change="handleVideoUpload"/>
                    </div>

                    <div class="previews">
                        <div class="preview-item" v-for="(file, index) in markFiles.videos" :key="index">
                            <video :src="getObjectURL(file)" controls></video>
                        </div>
                    </div>
                </div>
       
            </div>

            <button type="submit" class="default-button create-mark-button">Сохранить</button>
        </form>

        <div :class="{ 'modal': true, 'visible': isModalVisible }" class="mark-modal">
            <div>
                <p>Метка успешно создана</p>
                <div class="mark-form-btns">
                    <RouterLink to="/"><button @click="closeModalWindow">Ок</button></RouterLink>
                </div>
            </div> 
        </div>
        <div class="overlay" :class="{ 'visible': isModalVisible }"></div>

        <div :class="{ 'modal': true, 'visible': isErrorModalVisible }">
            <button @click="closeModalWindow" class="close-form-btn">✖</button>
            <p v-if="errors.length != 0" v-for="message in errors">{{ message }}</p>
        </div>
        <div class="overlay" :class="{ 'visible': isErrorModalVisible }"></div>
    </div>

    <div style="height: 3vh">
    </div>
</template>
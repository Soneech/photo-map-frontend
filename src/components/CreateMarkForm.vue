<script lang="ts" setup>
    import { ref } from 'vue';
    declare const URL: typeof window.URL;

    const isModalVisible = ref(false);

    const openModalWindow = () => {
        isModalVisible.value = true;
    };

    const closeModalWindow = () => {
        isModalVisible.value = false;
    }

    interface Mark {
        name: string,
        description: string
    }

    interface Files {
        photos: File[],
        videos: File[]
    }

    const mark = ref<Mark>({
        name: '',
        description: ''
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

</script>

<template>
    <div class="create-mark-form-block">
        <form class="create-mark-form">
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
    </div>

    <div style="height: 3vh">
    </div>
</template>
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
        note: string
        photoFiles: File[]
        videoFiles: File[]
    }

    const mark = ref<Mark>({
        note: '',
        photoFiles: [],
        videoFiles: []
    })

    function handlePhotoUpload(event: Event) {
        const files = (event.target as HTMLInputElement).files
        if (!files) return

        const fileArray = Array.from(files)
        const total = mark.value.photoFiles.length + fileArray.length

        if (total > 10) {
            alert('Можно загрузить не более 10 фотографий')
            return
        }

        mark.value.photoFiles.push(...fileArray)
    }

    function handleVideoUpload(event: Event) {
        const files = (event.target as HTMLInputElement).files
        if (!files) return

        const fileArray = Array.from(files)
        const total = mark.value.videoFiles.length + fileArray.length

        if (total > 3) {
            alert('Можно загрузить не более 3 видеофайлов')
            return
        }

        mark.value.videoFiles.push(...fileArray)
    }

    function getObjectURL(file: File): string {
        return URL.createObjectURL(file)
    }

</script>

<template>
    <div class="create-mark-form-block">
        <form class="create-mark-form">
            <textarea class="mark-note" placeholder="Ваша заметка" v-model="mark.note"></textarea>
            
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
                        <div class="preview-item" v-for="(file, index) in mark.photoFiles" :key="index">
                            <img :src="getObjectURL(file)" alt="preview"/>
                            <p>{{ file.name }}</p>
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
                        <div class="preview-item" v-for="(file, index) in mark.videoFiles" :key="index">
                            <video :src="getObjectURL(file)" controls></video>
                            <p>{{ file.name }}</p>
                        </div>
                    </div>
                </div>
       
            </div>

            <button type="submit" class="default-button create-mark-button">Сохранить</button>
        </form>
    </div>
</template>
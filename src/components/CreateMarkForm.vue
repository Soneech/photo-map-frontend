<script lang="ts" setup>
    import { ref } from 'vue';

    const isModalVisible = ref(false);

    const openModalWindow = () => {
        isModalVisible.value = true;
    };

    const closeModalWindow = () => {
        isModalVisible.value = false;
    }

    interface Mark {
        note: string
    }

    const mark = ref<Mark> ({
        note: ''
    });
</script>

<template>
    <div class="create-mark-form-block">
        <form class="create-mark-form">
            <textarea class="mark-note" placeholder="Ваша заметка" v-model="mark.note"></textarea>
            
            <div>

            </div>
        </form>
    </div>
</template>
import { ref } from "vue"

export const categoriesVisible = ref<boolean>(false)
export const showOnlyMyMarks = ref<boolean>(false)

export const showUserMarks = ref<boolean>(false)
export const selectedUserId = ref<string>(null)

export function handleCategoriesListAction() {
    categoriesVisible.value = !categoriesVisible.value
}

export function handleMyMapAction() {
    showOnlyMyMarks.value = true
}

export function showAllMarks() {
    showOnlyMyMarks.value = false
    showUserMarks.value = false
    selectedUserId.value = null
}

export function handleShowUserMarks(userId: string) {
    showUserMarks.value = true
    selectedUserId.value = userId
} 
import { ref } from "vue"

export const categoriesVisible = ref<boolean>(false)

export function handleCategoriesListAction() {
    categoriesVisible.value = !categoriesVisible.value
    console.log(categoriesVisible.value)
}
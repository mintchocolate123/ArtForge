import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
    const currentModule = ref('tileset')  // 當前功能模組
    const currentPath = ref('.')          // 當前資料夾路徑
    const selectedResource = ref(null)    // 當前選取的資源

    function setModule(module) {
        currentModule.value = module
    }

    function setPath(path) {
        currentPath.value = path
    }

    function setSelectedResource(resource) {
        selectedResource.value = resource
    }

    return { currentModule, currentPath, selectedResource, setModule, setPath, setSelectedResource }
})
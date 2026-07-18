<template>
  <div class="module-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab"
      :class="{ active: currentModule === tab.id }"
      @click="appStore.setModule(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup>
import { useAppStore } from '../../stores/appStore'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { currentModule } = storeToRefs(appStore)

const tabs = [
  { id: 'tileset', label: 'Tileset' },
  { id: 'splice', label: '拼接' },
  { id: 'wfc', label: 'WFC 模擬' },
]
</script>

<style scoped>
.module-tabs {
  display: flex;
  background: #0f3460;
  border-bottom: 1px solid #0f3460;
  flex-shrink: 0;
}

.tab {
  padding: 8px 20px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #666;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  cursor: pointer;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.15s;
}

.tab:hover { color: #e0e0e0; }
.tab.active {
  color: #e94560;
  border-bottom-color: #e94560;
}
</style>
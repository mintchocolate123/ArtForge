<template>
  <div class="resource-panel">
    <div class="panel-header">
      <span class="panel-title">資源管理</span>
    </div>

    <div class="current-path" v-if="currentSubPath">
      <span @click="goUp" class="path-up">↑ 上層</span>
      <span class="path-text">{{ currentSubPath }}</span>
    </div>

    <div class="file-list" v-if="files.length > 0">
      <div
        v-for="file in files"
        :key="file.path"
        class="file-item"
        :class="{ active: selectedResource?.path === file.path }"
        @click="handleClick(file)"
      >
        <span class="file-icon">{{ getIcon(file) }}</span>
        <span class="file-name">{{ file.name }}</span>
      </div>
    </div>

    <div class="empty" v-else>
      <span>resource/ 資料夾是空的</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/appStore'
import { listFiles } from '../../api/files'

const appStore = useAppStore()
const { selectedResource } = storeToRefs(appStore)

const files = ref([])
const currentSubPath = ref('')

async function loadFiles(subPath = '') {
  const result = await listFiles(subPath)
  if (result.files) files.value = result.files
  currentSubPath.value = subPath
}

async function goUp() {
  const parts = currentSubPath.value.replace(/\\/g, '/').split('/')
  parts.pop()
  await loadFiles(parts.join('/'))
}

async function handleClick(file) {
  if (file.is_dir) {
    await loadFiles(file.path)
  } else {
    appStore.setSelectedResource(file)
  }
}

function getIcon(file) {
  if (file.is_dir) return '📂'
  if (file.suffix === '.png') return '🖼️'
  if (file.suffix === '.json') return '📄'
  return '📃'
}

onMounted(() => loadFiles())
</script>

<style scoped>
.resource-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #0f3460;
  flex-shrink: 0;
}

.panel-title {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 2px;
}

.current-path {
  padding: 6px 12px;
  border-bottom: 1px solid #0f3460;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.path-up {
  font-size: 11px;
  color: #e94560;
  cursor: pointer;
}
.path-up:hover { text-decoration: underline; }

.path-text {
  font-size: 10px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-list {
  overflow-y: auto;
  flex: 1;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
  border-bottom: 1px solid #1a1a2e;
  transition: background 0.1s;
}
.file-item:hover { background: #0f3460; }
.file-item.active { background: #e94560; }

.file-icon { font-size: 12px; flex-shrink: 0; }

.file-name {
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
  font-size: 12px;
}
</style>
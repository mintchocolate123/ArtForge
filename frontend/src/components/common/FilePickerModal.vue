<template>
  <div class="picker-overlay" v-if="visible" @click.self="$emit('close')">
    <div class="picker-modal">
      <div class="picker-header">
        <span>{{ title }}</span>
        <button @click="$emit('close')">✕</button>
      </div>
      <div class="picker-search">
        <input v-model="searchQuery" placeholder="搜尋..." autofocus />
      </div>
      <div class="picker-list">
        <div v-for="f in filteredFiles" :key="f.path" class="picker-item" @click="$emit('select', f)">
          <span class="picker-icon">{{ getIcon(f) }}</span>
          <div class="picker-item-info">
            <span class="picker-item-name">{{ f.name }}</span>
            <span class="picker-item-path">{{ f.path }}</span>
          </div>
        </div>
        <div v-if="filteredFiles.length === 0" class="picker-empty">沒有找到檔案</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: String,
  files: { type: Array, default: () => [] },
})

defineEmits(['close', 'select'])

const searchQuery = ref('')

const filteredFiles = computed(() => {
  if (!searchQuery.value) return props.files
  const q = searchQuery.value.toLowerCase()
  return props.files.filter(f =>
    f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q)
  )
})

function getIcon(f) {
  if (f.suffix === '.png') return '🖼️'
  if (f.suffix === '.json') return '📄'
  if (f.is_dir) return '📂'
  return '📃'
}
</script>

<style scoped>
.picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-modal {
  background: #16213e;
  border: 1px solid #0f3460;
  outline: 5px solid #0f3460;
  outline-offset: 2px;
  border-radius: 8px;
  width: 50%;
  height: 75%;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid #0f3460;
  font-size: 12px;
  font-weight: bold;
  color: #e94560;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.picker-header button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}
.picker-header button:hover { color: #e94560; }

.picker-search {
  padding: 8px 10px;
  border-bottom: 1px solid #0f3460;
}
.picker-search input {
  width: 100%;
  background: #1a1a2e;
  border: 1px solid #0f3460;
  color: #e0e0e0;
  padding: 5px 8px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
.picker-search input:focus { outline: none; border-color: #e94560; }

.picker-list { overflow-y: auto; flex: 1; }

.picker-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  cursor: pointer;
  border-bottom: 1px solid #1a1a2e;
  transition: background 0.1s;
}
.picker-item:hover { background: #0f3460; }

.picker-icon { font-size: 14px; flex-shrink: 0; }

.picker-item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}
.picker-item-name { font-size: 12px; color: #e0e0e0; }
.picker-item-path {
  font-size: 10px;
  color: #555;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.picker-empty {
  padding: 20px;
  text-align: center;
  color: #444;
  font-size: 12px;
}
</style>
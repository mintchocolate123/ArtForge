<template>
  <div class="file-picker-wrapper">
    <div class="file-picker" @click="open">
      <span class="file-picker-value">{{ modelValue || placeholder }}</span>
      <span class="file-picker-arrow">▼</span>
    </div>

    <FilePickerModal
      :visible="pickerVisible"
      :title="title"
      :files="files"
      @close="pickerVisible = false"
      @select="onSelect"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { listAllFiles } from '../../api/files'
import FilePickerModal from './FilePickerModal.vue'

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: '-- 選擇檔案 --' },
  title: { type: String, default: '選擇檔案' },
  suffix: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'select'])

const pickerVisible = ref(false)
const files = ref([])

async function open() {
  const result = await listAllFiles(props.suffix)
  files.value = result.files || []
  pickerVisible.value = true
}

function onSelect(file) {
  pickerVisible.value = false
  emit('update:modelValue', file.name)
  emit('select', file)
}
</script>

<style scoped>
.file-picker-wrapper {
  flex: 1;
}

.file-picker {
  width: 100%;
  background: #1a1a2e;
  border: 1px solid #0f3460;
  color: #e0e0e0;
  padding: 4px 8px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.15s;
}
.file-picker:hover { border-color: #e94560; }

.file-picker-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #e0e0e0;
}

.file-picker-arrow { color: #444; flex-shrink: 0; margin-left: 4px; }
</style>
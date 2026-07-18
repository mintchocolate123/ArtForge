<template>
  <div class="tileset-config">
    <div class="config-header" :class="{ collapsed: !expanded }" @click="expanded = !expanded">
      <span>⚙ 設定</span>
      <span>{{ expanded ? '▼' : '▶' }}</span>
    </div>

    <div class="config-body" v-if="expanded">
      <div class="config-row">
        <label>PNG</label>
        <div class="file-picker" @click="openPicker('png')">
          <span class="file-picker-value">{{ selectedPNGName || '-- 選擇 PNG --' }}</span>
          <span class="file-picker-arrow">▼</span>
        </div>
      </div>

      <template v-if="selectedPNGPath">
        <div class="config-row">
          <label>圖塊</label>
          <input type="number" v-model.number="tileSize" min="1" style="width:60px; background:#1a1a2e; border:1px solid #0f3460; color:#e0e0e0; padding:4px 6px; font-family:'Courier New',monospace; font-size:11px;" @input="updatePreview" />
          <span style="font-size:11px; color:#555;">px</span>
        </div>
        <div class="config-row">
          <label>間距</label>
          <input type="number" v-model.number="spacing" min="0" style="width:60px; background:#1a1a2e; border:1px solid #0f3460; color:#e0e0e0; padding:4px 6px; font-family:'Courier New',monospace; font-size:11px;" @input="updatePreview" />
          <span style="font-size:11px; color:#555;">px</span>
        </div>
        <div v-if="cols && rows" style="font-size:11px; color:#4caf50;">
          {{ cols }} 欄 × {{ rows }} 列 = {{ cols * rows }} 個圖塊
        </div>
        <div class="config-row">
          <label>JSON</label>
          <div class="file-picker" @click="openPicker('json')">
            <span class="file-picker-value">{{ selectedJSONName || '-- 選擇現有 JSON（可選）--' }}</span>
            <span class="file-picker-arrow">▼</span>
          </div>
        </div>
        <button @click="confirm" style="background:#e94560; border:none; color:white; padding:5px 12px; font-family:'Courier New',monospace; font-size:11px; cursor:pointer; align-self:flex-end; letter-spacing:1px;">確認</button>
      </template>
    </div>

    <div class="picker-overlay" v-if="pickerVisible" @click.self="pickerVisible = false">
      <div class="picker-modal">
        <div class="picker-header">
          <span>選擇 {{ pickerType === 'png' ? 'PNG 圖片' : 'JSON 規則' }}</span>
          <button @click="pickerVisible = false">✕</button>
        </div>
        <div class="picker-search">
          <input v-model="searchQuery" placeholder="搜尋..." autofocus />
        </div>
        <div class="picker-list">
          <div v-for="f in filteredFiles" :key="f.path" class="picker-item" @click="selectFile(f)">
            <span class="picker-icon">{{ pickerType === 'png' ? '🖼️' : '📄' }}</span>
            <div class="picker-item-info">
              <span class="picker-item-name">{{ f.name }}</span>
              <span class="picker-item-path">{{ f.path }}</span>
            </div>
          </div>
          <div v-if="filteredFiles.length === 0" class="picker-empty">沒有找到檔案</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTilesetStore } from '../../stores/tilesetStore'
import { listAllFiles, readFile, getImageUrl } from '../../api/files'

const tilesetStore = useTilesetStore()

const expanded = ref(true)
const pickerVisible = ref(false)
const pickerType = ref('png')
const pickerFiles = ref([])
const searchQuery = ref('')

const selectedPNGPath = ref('')
const selectedPNGName = ref('')
const selectedJSONPath = ref('')
const selectedJSONName = ref('')

const tileSize = ref(16)
const spacing = ref(1)
const cols = ref(0)
const rows = ref(0)

const filteredFiles = computed(() => {
  if (!searchQuery.value) return pickerFiles.value
  const q = searchQuery.value.toLowerCase()
  return pickerFiles.value.filter(f =>
    f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q)
  )
})

async function openPicker(type) {
  pickerType.value = type
  searchQuery.value = ''
  const suffix = type === 'png' ? '.png' : '.json'
  const result = await listAllFiles(suffix)
  pickerFiles.value = result.files || []
  pickerVisible.value = true
}

async function selectFile(file) {
  pickerVisible.value = false

  if (pickerType.value === 'png') {
    selectedPNGPath.value = file.path
    selectedPNGName.value = file.name
    const url = await getImageUrl(file.path)
    const img = new Image()
    img.onload = () => {
      tilesetStore.loadImage(img)
      updatePreview()
    }
    img.src = url
  } else {
    selectedJSONPath.value = file.path
    selectedJSONName.value = file.name
  }
}

function updatePreview() {
  const image = tilesetStore.tilesetImage
  if (!image) return
  const ts = Number(tileSize.value)
  const sp = Number(spacing.value)
  cols.value = Math.floor((image.width + sp) / (ts + sp))
  rows.value = Math.floor((image.height + sp) / (ts + sp))
}

async function confirm() {
  if (selectedJSONPath.value) {
    const result = await readFile(selectedJSONPath.value)
    if (result.content) {
      tilesetStore.loadJSON(JSON.parse(result.content))
    }
  } else {
    tilesetStore.loadJSON({
      tile_size: tileSize.value,
      spacing: spacing.value,
      tiles: {},
      weights: {},
      rules: {},
      wfc: {}
    })
  }
  tilesetStore.setTilemapConfig(tileSize.value, spacing.value, cols.value, rows.value)
  expanded.value = false
}
</script>

<style scoped>
.tileset-config {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #16213e;
  border: 1px solid #0f3460;
  min-width: 300px;
  z-index: 10;
}

.config-header {
  display: flex;
  justify-content: space-between;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 11px;
  color: #e94560;
  text-transform: uppercase;
  letter-spacing: 1px;
  user-select: none;
  transition: opacity 0.2s;
}
.config-header:hover { background: #0f3460; }
.config-header.collapsed {
  opacity: 0.4;
}
.config-header.collapsed:hover { opacity: 0.8; }

.config-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #0f3460;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.config-row label {
  font-size: 11px;
  color: #888;
  width: 36px;
  flex-shrink: 0;
}

.file-picker {
  flex: 1;
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
.file-picker-value:empty { color: #444; }

.file-picker-arrow { color: #444; flex-shrink: 0; margin-left: 4px; }

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

.picker-list {
  overflow-y: auto;
  flex: 1;
}

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

.picker-item-name {
  font-size: 12px;
  color: #e0e0e0;
}

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
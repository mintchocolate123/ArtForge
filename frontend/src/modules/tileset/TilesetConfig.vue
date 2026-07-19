<template>
  <div class="config-content">
    <div class="config-row">
      <label>PNG</label>
      <FilePicker
        v-model="selectedPNGName"
        placeholder="-- 選擇 PNG --"
        title="選擇 PNG 圖片"
        suffix=".png"
        @select="onSelectPNG"
      />
    </div>

    <div v-if="selectedPNGPath" class="config-content">
      <div class="config-row">
        <label>圖塊</label>
        <input type="number" v-model.number="tileSize" min="1" @input="updatePreview" />
        <span class="unit">px</span>
      </div>
      <div class="config-row">
        <label>間距</label>
        <input type="number" v-model.number="spacing" min="0" @input="updatePreview" />
        <span class="unit">px</span>
      </div>
      <div v-if="cols && rows" class="config-info">
        {{ cols }} 欄 × {{ rows }} 列 = {{ cols * rows }} 個圖塊
      </div>
      <div class="config-row">
        <label>JSON</label>
        <FilePicker
          v-model="selectedJSONName"
          placeholder="-- 選擇現有 JSON（可選）--"
          title="選擇 JSON 規則"
          suffix=".json"
          @select="onSelectJSON"
        />
      </div>
      <button class="btn-confirm" @click="confirm">確認</button>
      <div class="config-row">
        <button class="btn-save" @click="save">儲存</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FilePicker from '../../components/common/FilePicker.vue'
import { useTilesetStore } from '../../stores/tilesetStore'
import { readFile, getImageUrl } from '../../api/files'

const tilesetStore = useTilesetStore()

const selectedPNGPath = ref('')
const selectedPNGName = ref('')
const selectedJSONPath = ref('')
const selectedJSONName = ref('')

const tileSize = ref(16)
const spacing = ref(1)
const cols = ref(0)
const rows = ref(0)

async function onSelectPNG(file) {
  selectedPNGPath.value = file.path
  selectedPNGName.value = file.name
  const url = await getImageUrl(file.path)
  const img = new Image()
  img.onload = () => {
    tilesetStore.loadImage(img)
    updatePreview()
  }
  img.src = url
}

function onSelectJSON(file) {
  selectedJSONPath.value = file.path
  selectedJSONName.value = file.name
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
  if (tilesetStore.tilesetData && Object.keys(tilesetStore.tilesetData.tiles).length > 0) {
    const save = window.confirm('切換 Tileset 前要儲存目前的變更嗎？')
    if (save) {
      await tilesetStore.saveJSON()
    }
  }

  if (selectedJSONPath.value) {
    tilesetStore.currentJSONPath = selectedJSONPath.value
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
}

async function save() {
  if (!tilesetStore.currentJSONPath) {
    const path = prompt('輸入儲存路徑（例如 tilesets/tileset.json）：')
    if (!path) return
    await tilesetStore.saveJSON(path)
  } else {
    await tilesetStore.saveJSON()
  }
}
</script>

<style scoped>
.config-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.config-row label {
  font-size: 11px;
  color: #888;
  width: 36px;
  flex-shrink: 0;
  line-height: 1;
  align-self: center;
}

.config-row input[type="number"] {
  width: 60px;
  background: #1a1a2e;
  border: 1px solid #0f3460;
  color: #e0e0e0;
  padding: 4px 6px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
}
.config-row input:focus { outline: none; border-color: #e94560; }

.unit { font-size: 11px; color: #555; }

.config-info { font-size: 11px; color: #4caf50; }

.btn-confirm {
  background: #e94560;
  border: none;
  color: white;
  padding: 5px 12px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  cursor: pointer;
  align-self: flex-end;
  letter-spacing: 1px;
  align-self: flex-start;
}
.btn-confirm:hover { background: #c73652; }

.btn-save {
  background: #4caf50;
  border: none;
  color: white;
  padding: 5px 12px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  cursor: pointer;
  letter-spacing: 1px;
}
.btn-save:hover { background: #388e3c; }
</style>
<template>
  <div class="tile-editor" v-if="selectedCell">
    <div class="editor-section">
      <div class="editor-row">
        <label>啟用</label>
        <input type="checkbox" v-model="editEnabled" @change="updateEnabled" />
      </div>
    </div>

    <div class="editor-section" :class="{ disabled: !editEnabled }"">
      <div class="editor-row">
        <label>名稱</label>
        <input v-model="editName" @blur="updateName" :placeholder="selectedCell.name ? '' : '未命名'" />
        <button v-if="!selectedCell.name" class="btn-small" @click="addName">命名</button>
      </div>
      <div class="editor-row">
        <label>權重</label>
        <input type="number" v-model.number="editWeight" min="0" @input="updateWeight" :disabled="!editEnabled" />
      </div>
    </div>

    <div class="editor-section" :class="{ disabled: !editEnabled }">
      <div class="section-title">相鄰規則</div>
      <div v-for="dir in ['up', 'down', 'left', 'right']" :key="dir" class="rule-row">
        <label>{{ dirLabel[dir] }}</label>
        <div class="rule-tiles">
          <div v-for="tileName in getRule(dir)" :key="tileName" class="rule-tile" @click="!editEnabled || removeRule(dir, tileName)">
            <canvas :ref="el => drawRuleTile(el, tileName)" width="24" height="24"></canvas>
          </div>
          <button class="btn-add" @click="openRulePicker(dir)" :disabled="!editEnabled">+</button>
        </div>
      </div>
    </div>

    <div class="picker-overlay" v-if="rulePickerVisible" @click.self="rulePickerVisible = false">
      <div class="picker-modal">
        <div class="picker-header">
          <span>選擇 {{ dirLabel[currentDir] }} 可相鄰的圖塊</span>
          <button @click="rulePickerVisible = false">✕</button>
        </div>
        <div class="picker-grid">
          <div
            v-for="(tile, name) in tilesetData.tiles"
            :key="name"
            class="picker-cell"
            :class="{ active: getRule(currentDir).includes(name) }"
            @click="toggleRule(name)"
          >
            <canvas :ref="el => drawRuleTile(el, name)" width="32" height="32"></canvas>
            <span class="picker-cell-name">{{ name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="empty" v-else>
    從底部選擇一個圖塊開始編輯
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTilesetStore } from '../../stores/tilesetStore'

const tilesetStore = useTilesetStore()
const { selectedCell, tilesetData, tilesetImage, tilemapConfig } = storeToRefs(tilesetStore)

const editEnabled = ref(true)
const editName = ref('')
const editWeight = ref(1)
const rulePickerVisible = ref(false)
const currentDir = ref('up')

const dirLabel = { up: '上方', down: '下方', left: '左方', right: '右方' }

watch(selectedCell, (cell) => {
  if (!cell?.name) return
  editName.value = cell.name
  editWeight.value = tilesetData.value.weights[cell.name] || 1
})

function getRule(dir) {
  if (!selectedCell.value?.name) return []
  return tilesetData.value.rules[selectedCell.value.name]?.[dir] || []
}

function addName() {
  const name = prompt('輸入圖塊名稱：')
  if (!name) return
  tilesetStore.setTile(name, selectedCell.value.row, selectedCell.value.col)
  tilesetStore.selectCell(selectedCell.value.row, selectedCell.value.col)
}

function updateName() {
  if (!editName.value || editName.value === selectedCell.value.name) return
  const { row, col, name: oldName } = selectedCell.value
  tilesetStore.removeTile(oldName)
  tilesetStore.setTile(editName.value, row, col)
  tilesetStore.selectCell(row, col)
}

function updateWeight() {
  if (!selectedCell.value?.name) return
  tilesetStore.updateWeight(selectedCell.value.name, editWeight.value)
}

function removeRule(dir, tileName) {
  tilesetStore.updateRule(selectedCell.value.name, dir, tileName, false)
}

function openRulePicker(dir) {
  currentDir.value = dir
  rulePickerVisible.value = true
}

function toggleRule(tileName) {
  const name = selectedCell.value.name
  const inRule = getRule(currentDir.value).includes(tileName)
  tilesetStore.updateRule(name, currentDir.value, tileName, !inRule)
}

function drawRuleTile(el, tileName) {
  if (!el || !tilesetImage.value || !tilesetData.value) return
  const tile = tilesetData.value.tiles[tileName]
  if (!tile) return
  const ctx = el.getContext('2d')
  ctx.imageSmoothingEnabled = false
  const tileSize = tilesetData.value.tile_size || 16
  const spacing = tilesetData.value.spacing || 0
  const sx = tile.col * (tileSize + spacing)
  const sy = tile.row * (tileSize + spacing)
  ctx.clearRect(0, 0, el.width, el.height)
  ctx.drawImage(tilesetImage.value, sx, sy, tileSize, tileSize, 0, 0, el.width, el.height)
}

watch(selectedCell, (cell) => {
  if (!cell) return
  editName.value = cell.name || ''
  editWeight.value = cell.name ? (tilesetData.value.weights[cell.name] || 1) : 1
  editEnabled.value = cell.name ? (tilesetData.value.tiles[cell.name]?.enabled !== false) : false
})

function updateEnabled() {
  if (!selectedCell.value?.name) return
  tilesetData.value.tiles[selectedCell.value.name].enabled = editEnabled.value
}
</script>

<style scoped>
.tile-editor {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
}

.unnamed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  color: #666;
  font-size: 12px;
}

.editor-section {
  margin-bottom: 16px;
  border: 1px solid #0f3460;
  padding: 10px;
}

.editor-section.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.btn-small {
  background: #e94560;
  border: none;
  color: white;
  padding: 3px 8px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  cursor: pointer;
}

.editor-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.editor-row label {
  font-size: 11px;
  color: #888;
  width: 40px;
  flex-shrink: 0;
}

.editor-row input {
  background: #1a1a2e;
  border: 1px solid #0f3460;
  color: #e0e0e0;
  padding: 4px 8px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  flex: 1;
}
.editor-row input:focus { outline: none; border-color: #e94560; }

.section-title {
  font-size: 10px;
  color: #e94560;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.rule-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.rule-row label {
  font-size: 11px;
  color: #888;
  width: 40px;
  flex-shrink: 0;
  padding-top: 4px;
}

.rule-tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
}

.rule-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  padding: 2px;
  border: 1px solid #0f3460;
}
.rule-tile:hover { border-color: #e94560; }

.rule-tile canvas { image-rendering: pixelated; }

.btn-add {
  background: #0f3460;
  border: 1px solid #e94560;
  color: #e94560;
  width: 28px;
  height: 28px;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}
.btn-add:hover { background: #e94560; color: white; }

.btn {
  background: #e94560;
  border: none;
  color: white;
  padding: 5px 12px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  cursor: pointer;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #444;
  font-size: 12px;
}

.picker-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
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
  width: 60%;
  height: 70%;
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
}
.picker-header button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}
.picker-header button:hover { color: #e94560; }

.picker-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px;
  overflow-y: auto;
}

.picker-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 4px;
  cursor: pointer;
  border: 1px solid #0f3460;
  transition: all 0.1s;
}
.picker-cell:hover { border-color: #888; }
.picker-cell.active { border-color: #4caf50; }

.picker-cell canvas { image-rendering: pixelated; }

.picker-cell-name {
  font-size: 8px;
  color: #666;
  max-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
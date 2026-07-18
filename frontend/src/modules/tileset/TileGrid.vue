<template>
  <div class="tile-grid" v-if="tilesetImage && tilemapConfig.cols > 0">
    <div class="grid-body">
      <div
        v-for="cell in allCells"
        :key="`${cell.row}-${cell.col}`"
        class="tile-cell"
        :class="{ named: cell.name, active: cell.name && cell.name === selectedTile }"
        @click="tilesetStore.selectCell(cell.row, cell.col)"
        :title="cell.name || '未命名'"
      >
        <canvas :ref="el => setCanvas(el, cell.row, cell.col)" width="32" height="32"></canvas>
        <span class="tile-label">{{ cell.name || '' }}</span>
      </div>
    </div>
  </div>
  <div class="empty" v-else>載入 PNG 後顯示圖塊</div>
</template>

<script setup>
import { computed, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useTilesetStore } from '../../stores/tilesetStore'

const tilesetStore = useTilesetStore()
const { tilesetData, tilesetImage, tilemapConfig, selectedTile } = storeToRefs(tilesetStore)

const canvases = {}

function setCanvas(el, row, col) {
  if (el) canvases[`${row}-${col}`] = el
}

const allCells = computed(() => {
  const { cols, rows } = tilemapConfig.value
  const cells = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const name = getTileName(row, col)
      cells.push({ row, col, name })
    }
  }
  return cells
})

function getTileName(row, col) {
  if (!tilesetData.value) return null
  for (const [name, tile] of Object.entries(tilesetData.value.tiles)) {
    if (tile.row === row && tile.col === col) return name
  }
  return null
}

function drawTile(row, col) {
  const canvas = canvases[`${row}-${col}`]
  if (!canvas || !tilesetImage.value) return
  const { tileSize, spacing } = tilemapConfig.value
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  const sx = col * (tileSize + spacing)
  const sy = row * (tileSize + spacing)
  ctx.clearRect(0, 0, 32, 32)
  ctx.drawImage(tilesetImage.value, sx, sy, tileSize, tileSize, 0, 0, 32, 32)
}

watch([tilesetImage, tilemapConfig], async () => {
  await nextTick()
  allCells.value.forEach(cell => drawTile(cell.row, cell.col))
})
</script>

<style scoped>
.tile-grid {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.grid-body {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 10px;
  overflow-y: auto;
  flex: 1;
  align-content: flex-start;
}

.tile-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 4px;
  cursor: pointer;
  border: 1px solid #0f3460;
  transition: all 0.1s;
  width: 68px;
  flex-shrink: 0;
}
.tile-cell:hover { border-color: #888; background: #0f3460; }
.tile-cell.named { border-color: #4caf50; }
.tile-cell.active { border-color: #e94560; background: #1a1a2e; }

.tile-cell canvas { image-rendering: pixelated; }

.tile-label {
  font-size: 9px;
  color: #4caf50;
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #444;
  font-size: 12px;
}
</style>
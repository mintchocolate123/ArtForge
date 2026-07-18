<template>
  <div class="tilemap-viewer" v-if="tilesetImage && tilemapConfig.cols > 0">
    <canvas
      ref="canvas"
      @click="handleClick"
      @mousemove="handleHover"
      @mouseleave="hoveredCell = null"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useTilesetStore } from '../../stores/tilesetStore'

const tilesetStore = useTilesetStore()
const { tilesetImage, tilesetData, tilemapConfig, selectedTile } = storeToRefs(tilesetStore)

const canvas = ref(null)
const hoveredCell = ref(null)

const SCALE = 3

function draw() {
  if (!canvas.value || !tilesetImage.value) return
  const { tileSize, spacing, cols, rows } = tilemapConfig.value
  const cellSize = tileSize + spacing

  canvas.value.width = cols * tileSize * SCALE + (cols - 1) * spacing * SCALE
  canvas.value.height = rows * tileSize * SCALE + (rows - 1) * spacing * SCALE

  const ctx = canvas.value.getContext('2d')
  ctx.imageSmoothingEnabled = false

  ctx.drawImage(
    tilesetImage.value,
    0, 0,
    tilesetImage.value.width,
    tilesetImage.value.height,
    0, 0,
    canvas.value.width,
    canvas.value.height
  )

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * cellSize * SCALE
      const y = row * cellSize * SCALE
      const w = tileSize * SCALE
      const h = tileSize * SCALE

      const tileName = getTileName(row, col)

      if (tileName) {
        ctx.strokeStyle = 'rgba(76, 175, 80, 0.8)'
        ctx.lineWidth = 1.5
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
      }

      if (hoveredCell.value?.row === row && hoveredCell.value?.col === col) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.lineWidth = 1.5
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
      }

      if (tileName && tileName === selectedTile.value) {
        ctx.strokeStyle = '#e94560'
        ctx.lineWidth = 2
        ctx.strokeRect(x + 1, y + 1, w - 2, h - 2)
      }
    }
  }
}

function getTileName(row, col) {
  if (!tilesetData.value) return null
  for (const [name, tile] of Object.entries(tilesetData.value.tiles)) {
    if (tile.row === row && tile.col === col) return name
  }
  return null
}

function getCellFromEvent(e) {
  const rect = canvas.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const { tileSize, spacing } = tilemapConfig.value
  const cellSize = (tileSize + spacing) * SCALE
  return {
    col: Math.floor(x / cellSize),
    row: Math.floor(y / cellSize),
  }
}

function handleClick(e) {
  const cell = getCellFromEvent(e)
  const existing = getTileName(cell.row, cell.col)
  const name = prompt(existing ? `重新命名（目前：${existing}）：` : '輸入圖塊名稱：', existing || '')
  if (name === null) return
  if (name === '') {
    if (existing) tilesetStore.removeTile(existing)
    return
  }
  tilesetStore.setTile(name, cell.row, cell.col)
  draw()
}

function handleHover(e) {
  hoveredCell.value = getCellFromEvent(e)
  draw()
}

watch([tilesetImage, tilemapConfig, tilesetData, selectedTile], async () => {
  await nextTick()
  draw()
})
</script>

<style scoped>
.tilemap-viewer {
  padding: 20px;
  display: flex;
  justify-content: center;
}

canvas {
  cursor: crosshair;
  image-rendering: pixelated;
}
</style>
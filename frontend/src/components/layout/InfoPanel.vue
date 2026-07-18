<template>
  <div class="info-panel">
    <div class="panel-header">
      <span class="panel-title">詳細資訊</span>
    </div>

		<div class="section" v-if="selectedCell && tilesetData">
			<div class="section-title">選取的圖塊</div>
			<div class="tile-preview" v-if="tilesetImage">
				<canvas ref="previewCanvas" width="64" height="64"></canvas>
			</div>
			<div class="info-row">
				<span class="info-label">名稱</span>
				<span class="info-value">{{ selectedCell.name || '未命名' }}</span>
			</div>
			<div class="info-row">
				<span class="info-label">Row</span>
				<span class="info-value">{{ selectedCell.row }}</span>
			</div>
			<div class="info-row">
				<span class="info-label">Col</span>
				<span class="info-value">{{ selectedCell.col }}</span>
			</div>
			<template v-if="selectedCell.name">
				<div class="info-row">
					<span class="info-label">權重</span>
					<span class="info-value">{{ tilesetData.weights[selectedCell.name] || 1 }}</span>
				</div>
				<div class="section-title" style="margin-top: 12px">相鄰規則</div>
				<div v-for="dir in ['up', 'down', 'left', 'right']" :key="dir" class="info-row">
					<span class="info-label">{{ dirLabel[dir] }}</span>
					<span class="info-value">{{ (tilesetData.rules[selectedCell.name]?.[dir] || []).length }} 種</span>
				</div>
			</template>
		</div>

		<div class="empty" v-if="!selectedResource && !selectedCell">
			<span>選取資源或圖塊後顯示資訊</span>
		</div>

    <div class="section" v-if="selectedResource && !selectedCell">
      <div class="section-title">選取的圖塊</div>
      <div class="tile-preview" v-if="tilesetImage">
        <canvas ref="previewCanvas" width="64" height="64"></canvas>
      </div>
      <div class="info-row">
        <span class="info-label">名稱</span>
        <span class="info-value">{{ selectedTile }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Row</span>
        <span class="info-value">{{ tilesetData.tiles[selectedTile]?.row }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Col</span>
        <span class="info-value">{{ tilesetData.tiles[selectedTile]?.col }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">權重</span>
        <span class="info-value">{{ tilesetData.weights[selectedTile] || 1 }}</span>
      </div>
      <div class="section-title" style="margin-top: 12px">相鄰規則</div>
      <div v-for="dir in ['up', 'down', 'left', 'right']" :key="dir" class="info-row">
        <span class="info-label">{{ dirLabel[dir] }}</span>
        <span class="info-value">{{ (tilesetData.rules[selectedTile]?.[dir] || []).length }} 種</span>
      </div>
    </div>

    <div class="empty" v-if="!selectedResource && !selectedTile">
      <span>選取資源或圖塊後顯示資訊</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '../../stores/appStore'
import { useTilesetStore } from '../../stores/tilesetStore'

const appStore = useAppStore()
const tilesetStore = useTilesetStore()
const { selectedResource } = storeToRefs(appStore)
const { selectedTile, selectedCell, tilesetData, tilesetImage } = storeToRefs(tilesetStore)

const previewCanvas = ref(null)

const dirLabel = { up: '↑ 上', down: '↓ 下', left: '← 左', right: '→ 右' }

watch([selectedCell, tilesetImage], async () => {
  if (!selectedCell.value || !tilesetImage.value || !previewCanvas.value) return
  await nextTick()
  const { row, col } = selectedCell.value
  const ctx = previewCanvas.value.getContext('2d')
  ctx.imageSmoothingEnabled = false
  const tileSize = tilesetData.value.tile_size || 16
  const spacing = tilesetData.value.spacing || 0
  const sx = col * (tileSize + spacing)
  const sy = row * (tileSize + spacing)
  ctx.clearRect(0, 0, 64, 64)
  ctx.drawImage(tilesetImage.value, sx, sy, tileSize, tileSize, 0, 0, 64, 64)
})
</script>

<style scoped>
.info-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}

.panel-header {
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

.section {
  padding: 10px 12px;
  border-bottom: 1px solid #0f3460;
}

.section-title {
  font-size: 10px;
  color: #e94560;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.info-row {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 11px;
}

.info-label {
  color: #666;
  width: 40px;
  flex-shrink: 0;
}

.info-value {
  color: #e0e0e0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info-value.path {
  white-space: normal;
  word-break: break-all;
  font-size: 10px;
  color: #888;
}

.tile-preview {
  margin-bottom: 8px;
}

.tile-preview canvas {
  image-rendering: pixelated;
  border: 1px solid #0f3460;
}

.empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444;
  font-size: 12px;
  padding: 20px;
  text-align: center;
}
</style>
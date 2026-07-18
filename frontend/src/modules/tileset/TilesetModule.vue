<template>
  <div class="tileset-module">
    <TilesetConfig />
    <div v-if="!tilesetImage" class="empty">
    </div>
    <div v-else>
      <!-- 之後放編輯器 -->
      <p style="color:#e0e0e0; padding:20px;">已載入資源</p>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useTilesetStore } from '../../stores/tilesetStore'
import TilesetConfig from './TilesetConfig.vue'

const tilesetStore = useTilesetStore()
const { tilesetImage } = storeToRefs(tilesetStore)
</script>

<style scoped>
.tileset-module {
  height: 100%;
  overflow: auto;
  position: relative;
}
.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #444;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}
</style>
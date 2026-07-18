<template>
  <div class="tileset-module">
    <TilesetConfig />
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
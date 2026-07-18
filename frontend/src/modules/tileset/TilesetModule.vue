<template>
  <div class="tileset-module">
    <TileEditor />
  </div>
</template>

<script setup>
import TileEditor from './TileEditor.vue'
</script>

<style scoped>
.tileset-module {
  height: 100%;
  overflow: hidden;
}
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
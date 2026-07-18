<template>
  <AppLayout>
    <template #main>
      <TilesetModule v-if="currentModule === 'tileset'" />
      <div v-else-if="currentModule === 'splice'" class="coming-soon">拼接功能開發中</div>
      <div v-else-if="currentModule === 'wfc'" class="coming-soon">WFC 模擬開發中</div>
    </template>
    <template #bottom>
      <TileGrid v-if="currentModule === 'tileset'" />
    </template>
  </AppLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from './stores/appStore'
import AppLayout from './components/layout/AppLayout.vue'
import TilesetModule from './modules/tileset/TilesetModule.vue'
import TileGrid from './modules/tileset/TileGrid.vue'

const appStore = useAppStore()
const { currentModule } = storeToRefs(appStore)
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #1a1a2e; }
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #1a1a2e; }
::-webkit-scrollbar-thumb { background: #0f3460; }
::-webkit-scrollbar-thumb:hover { background: #e94560; }

.coming-soon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #444;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}
</style>
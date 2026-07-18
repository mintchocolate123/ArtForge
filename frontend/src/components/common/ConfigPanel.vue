<template>
  <div class="config-panel">
    <div class="config-header" :class="{ collapsed: !expanded }" @click="expanded = !expanded">
      <span>⚙ 設定</span>
      <span>{{ expanded ? '▼' : '▶' }}</span>
    </div>
    <div class="config-body" v-if="expanded">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const expanded = ref(true)
</script>

<style scoped>
.config-panel {
  background: #16213e;
  border: 1px solid #0f3460;
  display: inline-flex;
  flex-direction: column;
  min-width: 300px;
  margin: 10px;
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
.config-header.collapsed { opacity: 0.4; }
.config-header.collapsed:hover { opacity: 0.8; }

.config-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid #0f3460;
}
</style>
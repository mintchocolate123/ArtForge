<template>
  <div class="app-layout">
    <aside class="panel-left">
      <ResourcePanel />
    </aside>
    <div class="panel-center">
      <ModuleTabs />
      <div class="config-wrapper">
        <ConfigPanel>
          <slot name="config" />
        </ConfigPanel>
      </div>
      <div class="module-main">
        <slot name="main" />
      </div>
      <div class="module-bottom">
        <slot name="bottom" />
      </div>
    </div>
    <aside class="panel-right">
      <InfoPanel />
    </aside>
  </div>
</template>

<script setup>
import ResourcePanel from './ResourcePanel.vue'
import ModuleTabs from './ModuleTabs.vue'
import InfoPanel from './InfoPanel.vue'
import ConfigPanel from '../common/ConfigPanel.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #1a1a2e;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
}

.panel-left {
  width: 220px;
  background: #16213e;
  border-right: 1px solid #0f3460;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.panel-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.config-wrapper {
  position: absolute;
  top: 36px;
  left: 0;
  z-index: 10;
}

.module-main {
  flex: 1;
  overflow: auto;
}

.module-bottom {
  height: 200px;
  flex-shrink: 0;
  border-top: 1px solid #0f3460;
  overflow: auto;
}

.panel-right {
  width: 260px;
  background: #16213e;
  border-left: 1px solid #0f3460;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}
</style>
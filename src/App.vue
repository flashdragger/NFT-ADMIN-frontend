<template>
  <ConfigProvider>
    <router-view v-if="isRouterAlive" />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { ConfigProvider } from "ant-design-vue";
const isRouterAlive = ref(true)
const { width } = useWindowSize()

const isMobile = computed(() => width.value < 768)

function reload(callback?: Function) {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
    callback && callback()
  })
}


provide('reload', reload)
provide('isMobile', isMobile)
</script>

<style>
#app {
  height: 100%;
}

.ant-pro-sider {
  z-index: 20;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(100px, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-100px, 0);
}

.zoom-enter-active,
.zoom-leave-active {
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: zoomIn;
}

.zoom-leave-active {
  animation-direction: reverse;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }

  100% {
    opacity: 1;
  }
}

@keyframes zoomOut {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: scale3d(0.95, 0.95, 0.95);
  }
}
</style>

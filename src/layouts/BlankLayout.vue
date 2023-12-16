<template>
  <transition name="zoom" mode="out-in" appear>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </router-view>
  </transition>
</template>
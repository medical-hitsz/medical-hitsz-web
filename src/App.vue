<script setup lang="ts">
import { RouterView } from "vue-router";
import MyHeader from "@/components/MyHeader.vue";
</script>

<template>
  <MyHeader class="app-header" />
  <main class="app-main">
    <RouterView />
  </main>
</template>

<style lang="scss" scoped>
.app-header {
  flex-grow: 0;
  flex-shrink: 0;
}
.app-main {
  flex-grow: 1;
  flex-shrink: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
</style>

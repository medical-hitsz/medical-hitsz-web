<script setup lang="ts">
import { RouterView } from "vue-router";
import MyHeader from "@/components/MyHeader.vue";
import MyFooter from "./components/MyFooter.vue";
</script>

<template>
  <MyHeader class="app-header" />
  <main class="app-main">
    <RouterView />
  </main>
  <MyFooter class="app-footer" />
</template>

<style lang="scss" scoped>
$header-height: 60px;
.app-header {
  height: $header-height;
}
.app-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  min-height: calc(100% - $header-height + 1px);
}
.app-footer {
  height: 80px;
}
</style>

<script setup lang="ts">
import { RouterView } from "vue-router";
import MyHeader from "@/components/MyHeader.vue";
import MyFooter from "./components/MyFooter.vue";
import { uerAgentIsPC } from "@/utils/common";

const isPC = uerAgentIsPC();
</script>

<template>
  <div class="app-view" :class="isPC ? 'app-view-pc' : 'app-view-mobile'">
    <MyHeader class="app-header" />
    <main class="app-main">
      <RouterView />
    </main>
    <MyFooter v-if="isPC" class="app-footer" />
  </div>
</template>

<style lang="scss" scoped>
$header-height: 60px;
.app-view {
  width: 100%;
  height: 100%;
  .app-header {
    height: $header-height;
  }
  .app-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }
  .app-footer {
    height: 80px;
  }
}
.app-view-pc {
  min-width: 800px;
  .app-main {
    min-height: max(100% - $header-height, 450px);
  }
}
.app-view-mobile {
  width: 100%;
  .app-main {
    min-height: calc(100vh - $header-height);
  }
}
</style>

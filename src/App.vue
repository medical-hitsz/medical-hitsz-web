<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import MyHeader from "@/components/MyHeader.vue";
import MyFooter from "./components/MyFooter.vue";
import { userAgentIsPC } from "@/utils/common";
import { useCommonStore } from "@/stores/common";
import { computed } from "vue";

const isPc = userAgentIsPC();
const commonStore = useCommonStore();
const route = useRoute();

if (!isPc) {
  commonStore.setFooterVisible(false);
}

const headerVisible = computed(() => {
  return route.path !== "/" || commonStore.headerVisible;
});
</script>

<template>
  <div class="app-view" :class="isPc ? 'app-view-pc' : 'app-view-mobile'">
    <Transition>
      <MyHeader v-show="headerVisible" class="app-header" />
    </Transition>
    <main
      class="app-main"
      :class="{ 'app-main-no-header': !commonStore.headerVisible }"
    >
      <RouterView />
    </main>
    <MyFooter v-show="commonStore.footerVisible" class="app-footer" />
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

  .v-enter-active,
  .v-leave-active {
    transition: height 0.2s;
  }
  .v-enter-from,
  .v-leave-to {
    height: 0;
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
    min-height: calc(100% - $header-height);
    transition: 0.2s;
  }
  .app-main-no-header {
    min-height: 100%;
  }
}
</style>

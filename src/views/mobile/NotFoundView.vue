<script setup lang="ts">
import NotFound from "@/components/NotFound.vue";
</script>

<template>
  <NotFound class="absolute-center not-found-view" />
</template>

<style lang="scss" scoped>
.not-found-view {
  :deep(.el-empty__image) {
    width: 35vw;
  }
}
</style>

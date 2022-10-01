<script setup lang="ts"></script>

<template>
  <div class="not-found-view">
    <el-empty
      class="not-found-content"
      description="非常抱歉，没有找到您访问的页面..."
    />
  </div>
</template>

<style lang="scss" scoped>
.not-found-view {
  .not-found-content {
    margin-bottom: 50px;
  }
}
</style>

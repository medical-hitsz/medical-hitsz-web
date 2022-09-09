<script setup lang="ts"></script>

<template>
  <header class="my-header">
    <h3 class="my-header-item">医疗会话</h3>
  </header>
</template>

<style lang="scss" scoped>
.my-header {
  width: 100%;
  height: 60px;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.09);
  background-color: var(--my-white);
  display: flex;
  align-items: center;
  color: var(--my-black-mute);
  .my-header-item {
    margin-left: 20px;
  }
}
</style>

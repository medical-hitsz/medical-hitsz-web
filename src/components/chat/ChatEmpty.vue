<script setup lang="ts">
import { LogoUrl } from "@/constants/url";
</script>

<template>
  <div class="flex-row chat-empty">
    <img :src="LogoUrl" class="chat-empty-image" />
  </div>
</template>

<style lang="scss" scoped>
.chat-empty {
  justify-content: center;
  .chat-empty-image {
    width: 30%;
    opacity: 10%;
  }
}
</style>

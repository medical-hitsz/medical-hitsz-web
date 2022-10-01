<script setup lang="ts">
import { ref } from "vue";
import type { ChatRoom } from "@/types/service";
import ChatRoomList from "@/components/chat/ChatRoomList.vue";
import ChatWindow from "@/components/chat/ChatWindow.vue";
import ChatEmpty from "@/components/chat/ChatEmpty.vue";

const currentChatRoom = ref<ChatRoom | null>(null);
</script>

<template>
  <div class="common-view chat-view">
    <ChatRoomList v-model="currentChatRoom" class="chat-sidebar" />
    <ChatWindow
      v-if="currentChatRoom"
      :currentChatRoom="currentChatRoom"
      class="chat-main"
    />
    <ChatEmpty class="chat-main" v-else />
  </div>
</template>

<style lang="scss" scoped>
.chat-view {
  display: flex;
  flex-direction: row;
  height: calc(100% - 80px);
  width: calc(30% + 500px);
  .chat-sidebar {
    flex-shrink: 0;
    height: 100%;
    margin-right: 10px;
  }
  .chat-main {
    flex-grow: 1;
    height: 100%;
  }
}
</style>

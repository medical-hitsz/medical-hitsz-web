<script setup lang="ts">
import { ref } from "vue";
import type { ChatRoom } from "@/types/service";
import ChatRoomList from "@/components/chat/ChatRoomList.vue";
import ChatWindow from "@/components/chat/ChatWindow.vue";
import ChatEmpty from "@/components/chat/ChatEmpty.vue";
import { useCommonStore } from "@/stores/common";

const commonStore = useCommonStore();

const currentChatRoom = ref<ChatRoom | null>(null);
const sidebarVisible = ref(false);
const setSidebarVisible = () => {
  sidebarVisible.value = true;
};

const handleClickModal = () => {
  if (currentChatRoom.value) {
    sidebarVisible.value = false;
  }
};

commonStore.setHeaderVisible(false);
</script>

<template>
  <div class="chat-view">
    <div
      class="chat-modal"
      v-show="sidebarVisible"
      @click.self="handleClickModal"
    >
      <ChatRoomList
        v-model="currentChatRoom"
        class="chat-sidebar"
        :always-show-delete="true"
        :set-sidebar-visible="setSidebarVisible"
      />
    </div>
    <ChatWindow
      v-if="currentChatRoom"
      :current-chat-room="currentChatRoom"
      class="chat-main"
      :set-sidebar-visible="setSidebarVisible"
    />
    <ChatEmpty class="chat-main" v-else />
  </div>
</template>

<style lang="scss" scoped>
.chat-view {
  position: absolute;
  width: 100%;
  height: 100%;
  .chat-modal {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.2);
    z-index: 100;
    .chat-sidebar {
      width: 60%;
      height: 100%;
    }
  }
  .chat-main {
    height: 100%;
  }
}
</style>

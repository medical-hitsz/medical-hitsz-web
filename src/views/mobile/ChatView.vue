<script setup lang="ts">
import { reactive, ref } from "vue";
import type { ChatRoom } from "@/types/service";
import ChatRoomList from "@/components/chat/ChatRoomList.vue";
import ChatWindow from "@/components/chat/ChatWindow.vue";
import ChatEmpty from "@/components/chat/ChatEmpty.vue";

const currentChatRoom = ref<ChatRoom | null>(null);
const sidebarVisible = ref(false);
const setSidebarVisible = (visible = true) => {
  sidebarVisible.value = visible;
};

const handleClickModal = () => {
  if (currentChatRoom.value) {
    setSidebarVisible(false);
  }
};

const touchStart = reactive({ x: 0, y: 0 });
const handleTouchStart = (e: TouchEvent) => {
  touchStart.x = e.touches[0].clientX;
};
const handleTouchMove = (e: TouchEvent) => {
  const x = e.touches[0].clientX;
  if (x - touchStart.x > 30) {
    setSidebarVisible(true);
  } else if (x - touchStart.x < -30) {
    handleClickModal();
  }
};
</script>

<template>
  <div
    class="chat-view"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
  >
    <Transition>
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
    </Transition>
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
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1000;
    .chat-sidebar {
      width: 60%;
      height: 100%;
      transition: width 0.2s ease;
    }
  }
  .v-enter-active,
  .v-leave-active {
    transition: background-color 0.2s ease;
  }
  .v-enter-from,
  .v-leave-to {
    background-color: rgba(0, 0, 0, 0);
    .chat-sidebar {
      width: 0;
    }
  }
  .chat-main {
    height: 100%;
  }
}
</style>

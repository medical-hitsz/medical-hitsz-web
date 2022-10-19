<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import type { ChatRoom, Message, SocketChatMessage } from "@/types/service";
import { useUserStore } from "@/stores/user";
import { LogoSUrl } from "@/constants/url";
import { getDateFormat } from "@/utils/common";
import chatApi from "@/api/chat";
import type { WebSocketInterface } from "@/types/common";
import { connectWebSocket } from "@/api/socket";
import type { ElScrollbar } from "element-plus";
import { useCommonStore } from "@/stores/common";
import { setStorage, getStorage } from "@/utils/storage";

const props = defineProps<{
  currentChatRoom: ChatRoom;
  setSidebarVisible?: () => void;
}>();
const currentChatRoom = computed(() => props.currentChatRoom);

const userStore = useUserStore();
const commonStore = useCommonStore();
const user = computed(() => userStore.user);

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const scrollbarInnerRef = ref<HTMLDivElement>();

const systemName = "智能诊疗会话小助手";
const loading = ref(false);
const webSocket = ref<WebSocketInterface | null>(null);
const headerVisibleKey = "headerVisible";

const msgList = reactive<Message[]>([]);
const now = ref(new Date());
const transformDate = (date: number) => {
  return getDateFormat(new Date(date), now.value);
};
const getMsgList = async () => {
  try {
    loading.value = true;
    const { data: newMsgList } = await chatApi.getMsgList({
      id: currentChatRoom.value.roomID,
    });
    msgList.splice(0);
    msgList.push(...newMsgList.sort((msg1, msg2) => msg1.msgID - msg2.msgID));
  } catch {
    return;
  } finally {
    loading.value = false;
  }
};

const sendMessage = (message: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (webSocket.value && currentChatRoom.value) {
      webSocket.value
        .sendMessage({ roomID: currentChatRoom.value.roomID, message })
        .then(() => {
          resolve();
        });
    } else {
      reject();
    }
  });
};

const receiveMessage = (socketChatMessage: SocketChatMessage) => {
  if (currentChatRoom.value?.roomID === socketChatMessage.roomID) {
    addMsg(socketChatMessage.message, false);
  }
};

const connetWebSocket = () => {
  webSocket.value = connectWebSocket(receiveMessage);
};

const addMsg = (msg: string, isUser: boolean) => {
  msgList.push({
    msgID: 0,
    msg,
    isUser,
    createTime: new Date().valueOf(),
  });
};

watch(
  currentChatRoom,
  () => {
    getMsgList();
  },
  { immediate: true }
);

watch(msgList, () => {
  nextTick(() => {
    if (scrollbarInnerRef.value?.clientHeight) {
      scrollbarRef.value?.setScrollTop(scrollbarInnerRef.value.clientHeight);
    }
  });
});

const input = ref("");
const handleEnter = () => {
  input.value += "\n";
};
const handleSubmit = () => {
  const handledInput = input.value.trimEnd();
  if (!handledInput) {
    return;
  }
  input.value = "";
  sendMessage(handledInput).then(() => {
    addMsg(handledInput, true);
  });
};

const handleHeaderShow = () => {
  commonStore.setHeaderVisible(true);
  setStorage(headerVisibleKey, true);
};
const handleHeaderHide = () => {
  commonStore.setHeaderVisible(false);
  setStorage(headerVisibleKey, false);
};

onMounted(() => {
  connetWebSocket();
});
onBeforeUnmount(() => {
  if (webSocket.value) {
    webSocket.value.disconnect();
    webSocket.value = null;
  }
});

if (getStorage(headerVisibleKey) === false && props.setSidebarVisible) {
  handleHeaderHide();
}
</script>

<template>
  <div
    class="chat-window"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 0.7)"
  >
    <div
      class="chat-window-title"
      :class="{ 'chat-window-title-no-radius': setSidebarVisible }"
    >
      <span>{{ currentChatRoom.roomName }}</span>
      <template v-if="setSidebarVisible">
        <el-icon
          class="chat-window-title-expand"
          v-if="setSidebarVisible"
          @click="setSidebarVisible"
        >
          <Expand />
        </el-icon>

        <el-icon
          v-if="commonStore.headerVisible"
          class="chat-window-title-header-control"
          @click="handleHeaderHide"
        >
          <ArrowUpBold />
        </el-icon>
        <el-icon
          v-else
          class="chat-window-title-header-control"
          @click="handleHeaderShow"
        >
          <ArrowDownBold />
        </el-icon>
      </template>
    </div>
    <el-scrollbar class="chat-window-body" ref="scrollbarRef">
      <div class="chat-window-inner-body" ref="scrollbarInnerRef">
        <template v-for="message in msgList" :key="message.createTime">
          <div
            v-if="message.isUser"
            class="chat-window-msg chat-window-msg-right"
          >
            <div class="chat-window-msg-body">
              <div class="chat-window-msg-top">
                <span class="chat-window-msg-time" v-if="!setSidebarVisible">
                  {{ transformDate(message.createTime) }}
                </span>
                <span class="chat-window-msg-name">{{ user.nickname }}</span>
              </div>
              <div class="chat-window-msg-content">{{ message.msg }}</div>
            </div>
            <el-avatar class="chat-window-msg-avatar" :src="user.avatar" />
          </div>
          <div v-else class="chat-window-msg">
            <el-avatar class="chat-window-msg-avatar" :src="LogoSUrl" />
            <div class="chat-window-msg-body">
              <div class="chat-window-msg-top">
                <span class="chat-window-msg-name">{{ systemName }}</span>
                <span class="chat-window-msg-time" v-if="!setSidebarVisible">
                  {{ transformDate(message.createTime) }}
                </span>
              </div>
              <div class="chat-window-msg-content">{{ message.msg }}</div>
            </div>
          </div>
        </template>
      </div>
    </el-scrollbar>
    <div class="chat-window-footer">
      <el-input
        class="chat-window-textarea"
        v-model="input"
        :placeholder="`发送给 ${systemName}`"
        type="textarea"
        resize="none"
        autofocus
        :autosize="{ minRows: 2, maxRows: 4 }"
        @keyup.enter.exact="handleSubmit"
        @keyup.ctrl.enter.exact="handleEnter"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-window {
  background-color: var(--el-color-primary-light-9);
  display: flex;
  flex-direction: column;
  .chat-window-title {
    flex-shrink: 0;
    font-size: 17px;
    font-weight: 500;
    padding: 10px;
    color: var(--my-white);
    letter-spacing: 1px;
    background-color: #8ec5fc;
    background-image: linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%);
    border-radius: 10px 10px 0 0;
    text-align: center;
    position: relative;
  }
  .chat-window-title-expand {
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    font-size: 20px;
  }
  .chat-window-title-header-control {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    font-size: 20px;
  }
  .chat-window-title-no-radius {
    border-radius: 0 0 0 0;
  }
  .chat-window-body {
    width: 100%;
    flex-grow: 1;
    overflow: hidden;
    :deep(.el-scrollbar__wrap) {
      width: 100%;
      .chat-window-inner-body {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .chat-window-msg {
          display: flex;
          margin: 20px 20px 0;
          max-width: calc(100% - 70px);
          &:last-child {
            margin-bottom: 20px;
          }
          .chat-window-msg-avatar {
            flex-shrink: 0;
          }
          .chat-window-msg-body {
            text-align: start;
            margin: 0 10px;
            .chat-window-msg-top {
              margin-bottom: 7px;
              line-height: 15px;
              .chat-window-msg-name {
                color: var(--my-gray);
                font-size: 15px;
              }
              .chat-window-msg-time {
                color: var(--my-gray);
                font-size: 12px;
                visibility: hidden;
                margin: 0 7px;
              }
            }
            .chat-window-msg-content {
              border-radius: 5px;
              background-color: var(--my-white);
              border: 1px solid var(--my-gray-light-2);
              padding: 7px 10px;
              color: var(--my-gray-dark-1);
              width: fit-content;
              word-break: break-all;
            }
          }
          &:hover {
            .chat-window-msg-time {
              visibility: visible !important;
            }
          }
        }
        .chat-window-msg-right {
          align-self: flex-end;
          .chat-window-msg-body {
            .chat-window-msg-top {
              text-align: right;
            }
            .chat-window-msg-content {
              background-color: var(--el-color-primary-light-3) !important;
              color: var(--my-white) !important;
              border: 1px solid var(--el-color-primary-light-3) !important;
              margin-left: auto;
            }
          }
        }
      }
    }
  }
  .chat-window-footer {
    padding: 10px;
    letter-spacing: 1px;
    .chat-window-textarea {
      letter-spacing: 1px;
    }
  }
}
</style>

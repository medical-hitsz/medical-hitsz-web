<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ChatRoom } from "@/types/service";
import chatApi from "@/api/chat";

const props = defineProps<{
  modelValue: ChatRoom | null;
}>();
const emit = defineEmits(["update:modelValue"]);
const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const loading = ref(false);

const roomList = reactive<ChatRoom[]>([]);
const getRoomList = async (targetRoomID?: string) => {
  try {
    loading.value = true;
    const res = await chatApi.getRoomList();
    const data = res.data || [];
    if (!data?.length) {
      modelValue.value = null;
    }
    const sortedArr = data.sort((room1, room2) => {
      return room2.lastMsgTime - room1.lastMsgTime;
    });
    roomList.splice(0);
    roomList.push(...sortedArr);
    if (!targetRoomID) {
      modelValue.value = roomList[0];
      return;
    }
    const filteredRoomList = roomList.filter((room) => {
      return room.roomID === targetRoomID;
    });
    modelValue.value = filteredRoomList.length
      ? filteredRoomList[0]
      : roomList[0];
  } catch {
    return;
  } finally {
    loading.value = false;
  }
};

const handleChosenChatRoom = (room: ChatRoom) => {
  modelValue.value = room;
};

const handleDeleteChatRoom = async (room: ChatRoom) => {
  try {
    await ElMessageBox.confirm(
      "您确定要删除这个会话吗？删除后聊天记录不可恢复！",
      "删除会话",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }
    );
    await chatApi.deleteRoom({ roomID: room.roomID });
    ElMessage({
      type: "success",
      message: "删除成功！",
    });
    await getRoomList(modelValue.value?.roomID);
  } catch {
    return;
  }
};

const handleCreateChatRoom = async () => {
  try {
    const { value } = await ElMessageBox.prompt("", "新建会话", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValidator: (val: string) => {
        return val ? true : "会话名不能为空！";
      },
      inputErrorMessage: "会话名不能为空！",
      inputPlaceholder: "请输入会话名",
    });
    const { data } = await chatApi.createRoom({ roomName: value });
    ElMessage({
      type: "success",
      message: `新建会话: ${value}`,
    });
    await getRoomList(data.roomID);
  } catch {
    return;
  }
};

getRoomList();
</script>

<template>
  <div
    class="chat-room-list"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 0.7)"
  >
    <div class="chat-room-list-count">
      {{
        roomList.length ? `共${roomList.length}个会话` : `点击下方按钮创建会话`
      }}
    </div>
    <el-scrollbar v-if="roomList.length" class="chat-room-list-items">
      <div
        v-for="room in roomList"
        :key="room.roomID"
        @click="handleChosenChatRoom(room)"
        class="flex-row chat-room-list-item"
        :class="{ 'chat-room-list-item-active': room === modelValue }"
      >
        <div class="chat-room-list-item-name">{{ room.roomName }}</div>
        <el-icon
          @click.stop="handleDeleteChatRoom(room)"
          class="chat-room-list-item-close"
          :size="18"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </el-scrollbar>
    <el-button
      @click="handleCreateChatRoom"
      type="primary"
      class="chat-room-list-create"
    >
      新建会话
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.chat-room-list {
  width: 200px;
  background-color: var(--el-color-primary-light-9);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 10px;
  .chat-room-list-count {
    flex-shrink: 0;
    $height: 30px;
    height: $height;
    line-height: $height;
    color: var(--my-gray-light-1);
    font-size: 12px;
  }
  .chat-room-list-items {
    flex-grow: 0;
    flex-shrink: 1;
    overflow: auto;
    width: 100%;
    .chat-room-list-item {
      height: 50px;
      width: 180px;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 15px;
      border-radius: 10px;
      background-color: var(--el-color-primary-light-8);
      cursor: pointer;
      margin: 5px auto 10px;
      .chat-room-list-item-name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .chat-room-list-item-close {
        color: var(--my-gray-dark-1);
        visibility: hidden;
      }
      &:hover {
        background-color: var(--el-color-primary-light-5);
        .chat-room-list-item-name {
          color: var(--my-white) !important;
        }
        .chat-room-list-item-close {
          visibility: visible;
          &:hover {
            color: var(--my-red);
          }
        }
      }
      .chat-room-list-item-name {
        letter-spacing: 1px;
        color: var(--my-gray-dark-1);
      }
    }
    .chat-room-list-item-active {
      background-color: var(--el-color-primary-light-3) !important;
      .chat-room-list-item-name {
        color: var(--my-white) !important;
      }
    }
  }
  .chat-room-list-create {
    flex-shrink: 0;
    width: 120px;
    margin: 10px 0;
  }
}
</style>

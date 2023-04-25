<script setup lang="ts">
import { computed, reactive, ref, watch, nextTick } from "vue";
import { ElMessage, ElMessageBox, type FormRules } from "element-plus";
import type { ChatRoom, Model } from "@/types/service";
import chatApi from "@/api/chat";
import modelApi from "@/api/model";

const props = defineProps<{
  modelValue: ChatRoom | null;
  setSidebarVisible?: (visible?: boolean) => void;
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
const dialogVisible = ref(false);
const formRef = ref();
const createRoomForm = reactive({
  roomName: "",
  modelId: "",
});
const rules = reactive<FormRules>({
  roomName: [{ required: true, trigger: "blur", message: "请输入会话名称" }],
  modelId: [
    {
      required: true,
      type: "integer",
      message: "请选择会话模型服务",
      trigger: "blur",
    },
  ],
});

const modelList = reactive<Model[]>([]);
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
    if (props.setSidebarVisible && roomList.length === 0) {
      props.setSidebarVisible();
    } else {
      props.setSidebarVisible && props.setSidebarVisible(false);
    }
  }
};

const getModelList = async () => {
  try {
    const res = await modelApi.getModelList();
    const _modelList = res.data || [];
    modelList.splice(0);
    modelList.push(..._modelList);
  } catch {
    return;
  }
};

const handleChosenChatRoom = (room: ChatRoom) => {
  modelValue.value = room;
  props.setSidebarVisible && props.setSidebarVisible(false);
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

const handleSubmitCreateRoomForm = async () => {
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return;
    }
    dialogVisible.value = false;
    const name = createRoomForm.roomName;
    const { data } = await chatApi.createRoom(createRoomForm);
    ElMessage({
      type: "success",
      message: `新建会话: ${name}`,
    });
    await getRoomList(data.roomID);
  });
};

watch(dialogVisible, (val) => {
  if (val) {
    getModelList();
    nextTick(() => {
      formRef.value.resetFields();
    });
  }
});

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
          :class="{
            'chat-room-list-item-close-always-show': props.setSidebarVisible,
          }"
          :size="18"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
    </el-scrollbar>
    <el-button
      @click="dialogVisible = true"
      type="primary"
      class="chat-room-list-create"
    >
      新建会话
    </el-button>

    <el-dialog
      v-model="dialogVisible"
      title="新建会话"
      class="chat-room-list-create-room"
      append-to-body
    >
      <el-form :model="createRoomForm" :rules="rules" ref="formRef">
        <el-form-item prop="roomName" class="form-item">
          <el-input
            v-model="createRoomForm.roomName"
            placeholder="请输入会话名称"
          />
        </el-form-item>
        <el-form-item prop="modelId" class="form-item">
          <el-select
            v-model="createRoomForm.modelId"
            placeholder="请选择会话模型服务"
          >
            <el-option
              v-for="model in modelList"
              :key="model.modelId"
              :label="model.modelName"
              :value="model.modelId"
            >
              <span style="float: left">{{ model.modelName }}</span>
              <span
                style="
                  float: right;
                  color: var(--el-text-color-secondary);
                  font-size: 13px;
                "
                >{{ model.runningStatus ? "运行中" : "未运行" }}</span
              >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitCreateRoomForm()">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.chat-room-list {
  background-color: var(--el-color-primary-light-9);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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
      max-width: min(180px, 100% - 20px);
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
      .chat-room-list-item-close-always-show {
        visibility: visible;
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
    width: min(120px, 100% - 20px);
    margin: 10px 0;
  }
}
</style>

<style>
.chat-room-list-create-room {
  width: min(600px, 90%);
}
</style>

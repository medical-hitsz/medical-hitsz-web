<script setup lang="ts">
import AvatarUpload from "@/components/AvatarUpload.vue";
import { useUserStore } from "@/stores/user";
import type { User } from "@/types/service";
import { reactive, watch } from "vue";
import userAPi from "@/api/user";
import { ElMessage, ElMessageBox } from "element-plus";

const userStore = useUserStore();

const userData = reactive<User>(userStore.user);

const userDataTransform = reactive({
  nickname: "昵称",
  avatar: "头像",
});

const refreshUserInfo = async () => {
  try {
    const res = await userAPi.getUserInfo();
    Object.assign(userData, res.data);
    userStore.setUserInfo(res.data);
  } catch {
    return;
  }
};

const updateUserInfo = async (params: {
  nickname?: string;
  avatar?: string;
}) => {
  for (const key in params) {
    if (!params[key as keyof typeof params]) {
      ElMessage.error(
        `${userDataTransform[key as keyof typeof params]}不能为空！`
      );
      return;
    }
  }
  try {
    await userAPi.updateUserInfo(params);
    await refreshUserInfo();
    ElMessage.success("更新成功！");
  } catch {
    return;
  }
};

const handleClickNickname = async () => {
  try {
    const { value } = await ElMessageBox.prompt("", "修改昵称", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValidator: (val: string) => {
        return val ? true : "昵称不能为空！";
      },
      inputErrorMessage: "昵称不能为空！",
      inputPlaceholder: "请输入昵称",
    });
    updateUserInfo({ nickname: value });
  } catch {
    return;
  }
};

refreshUserInfo().then(() => {
  watch(
    () => userData.avatar,
    (val) => {
      updateUserInfo({ avatar: val });
    }
  );
});
</script>

<template>
  <div class="user-center-view">
    <div class="user-center-title">用户中心</div>
    <div class="flex-row user-center-item">
      <div class="user-center-left">头像</div>
      <div class="user-center-right flex-row">
        <AvatarUpload
          v-model="userData.avatar"
          :size="50"
          :hoverDisable="true"
          class="user-center-avatar"
        />
        <el-icon class="user-center-arrow"><ArrowRight /></el-icon>
      </div>
    </div>
    <div class="flex-row user-center-item" @click="handleClickNickname">
      <div class="user-center-left">昵称</div>
      <div class="user-center-right flex-row">
        <div>{{ userData.nickname }}</div>
        <el-icon class="user-center-arrow"><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-center-view {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--my-gray-light-5);
  > * {
    background-color: white;
  }
  .user-center-title {
    margin-top: 10px;
    font-size: 18px;
    font-weight: 700;
    color: var(--my-gray-dark-1);
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .user-center-item {
    justify-content: space-between;
    padding: 20px 20px;
    border-top: 1px solid var(--my-divider-light-2);
    .user-center-left {
      color: var(--my-gray-dark-1);
      font-size: 16px;
      font-weight: 600;
    }
    .user-center-right {
      color: var(--my-gray);
      .user-center-arrow {
        margin-left: 10px;
      }
    }
  }
}
</style>

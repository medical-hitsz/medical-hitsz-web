<script setup lang="ts">
import AvatarUpload from "@/components/AvatarUpload.vue";
import { useUserStore } from "@/stores/user";
import type { User } from "@/types/service";
import { reactive, watch } from "vue";
import userAPi from "@/api/user";
import { ElMessage } from "element-plus";

const userStore = useUserStore();

const userData = reactive<User>(userStore.user);

const userDataTransform = reactive({
  nickname: "昵称",
  avatar: "头像",
});

const editButtonShow = (item: "nickname") => {
  return userStore.user[item] !== userData[item];
};

const handleCancel = (item: "nickname") => {
  userData[item] = userStore.user[item];
};

const handleSubmit = (item: "nickname") => {
  updateUserInfo({ [item]: userData[item] });
};

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
  <div class="common-view user-center-view">
    <div class="common-title">个人中心</div>
    <AvatarUpload
      v-model="userData.avatar"
      :size="80"
      class="user-center-avatar"
    />
    <div
      class="user-center-item"
      :class="{ 'user-center-item-edit': editButtonShow('nickname') }"
    >
      <div class="user-center-title">昵称</div>
      <el-input v-model="userData.nickname" class="user-center-input" />
      <Transition>
        <div
          class="user-center-button-group"
          v-show="editButtonShow('nickname')"
        >
          <el-button
            class="user-center-button"
            @click="handleSubmit('nickname')"
            type="primary"
            icon="Check"
            circle
          />
          <el-button
            class="user-center-button"
            @click="handleCancel('nickname')"
            type="info"
            icon="Close"
            circle
          />
        </div>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.user-center-view {
  width: 350px;
  padding-bottom: 30px;
  .user-center-avatar {
    margin: 20px;
  }
  .user-center-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    .user-center-title {
      margin-right: 20px;
      color: var(--my-gray);
    }
    .user-center-input {
      width: 200px;
      :deep(.el-input__wrapper) {
        box-shadow: none;
        &:hover {
          box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
        }
      }
      :deep(.is-focus) {
        box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset !important;
      }
    }

    .v-enter-active,
    .v-leave-active {
      transition: opacity 0.2s ease;
    }
    .v-enter-from,
    .v-leave-to {
      opacity: 0;
    }

    .user-center-button-group {
      .user-center-button {
        margin-left: 10px;
      }
    }
  }
  .user-center-item-edit {
    :deep(.el-input__wrapper) {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset !important;
    }
  }
}
</style>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import IconLogout from "@/components/icons/IconLogout.vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { LogoUrl } from "@/constants/url";
import { ref } from "vue";
import { userAgentIsPC } from "@/utils/common";

enum DropdownCommand {
  UserCenter,
  Model,
  Logout,
}

const elDropdownRef = ref();

const router = useRouter();
const userStore = useUserStore();
const { isLoggedIn, user } = storeToRefs(userStore);

const logout = () => {
  ElMessageBox.confirm("您确定要退出登录吗?", "退出登录", {
    confirmButtonText: "退出",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      userStore.logout();
      ElMessage({
        type: "success",
        message: "已退出，请重新登录",
      });
      router.push("/login");
    })
    .catch(() => {});
};

const handleCommand = (command: DropdownCommand) => {
  switch (command) {
    case DropdownCommand.UserCenter:
      router.push("user-center");
      break;
    case DropdownCommand.Model:
      router.push("model");
      break;
    case DropdownCommand.Logout:
      logout();
      break;
  }
};

const isPC = userAgentIsPC();
const mobileDropdownShow = ref(false);
const handleDropdownVisibleChange = (visible: boolean) => {
  mobileDropdownShow.value = visible;
};

const handleClickAvatar = () => {
  if (!isPC) {
    if (mobileDropdownShow.value) {
      elDropdownRef.value.handleClose();
    } else {
      elDropdownRef.value.handleOpen();
    }
  }
};
</script>

<template>
  <header class="my-header">
    <router-link class="flex-row my-header-title" to="/">
      <img :src="LogoUrl" class="my-header-title-logo" />
      <div class="my-header-title-text">智能诊疗会话系统</div>
    </router-link>
    <el-dropdown
      ref="elDropdownRef"
      v-if="isLoggedIn"
      @command="handleCommand"
      @visible-change="handleDropdownVisibleChange"
      size="large"
    >
      <el-avatar
        @click="handleClickAvatar"
        class="my-header-avatar"
        :size="40"
        :src="user.avatar"
      />
      <template #dropdown>
        <el-dropdown-menu class="my-header-dropdown">
          <div class="my-header-nickname">
            {{ user.nickname }}
          </div>
          <el-dropdown-item :command="DropdownCommand.UserCenter" divided>
            <el-icon><User /></el-icon>
            <span>用户中心</span>
          </el-dropdown-item>
          <el-dropdown-item :command="DropdownCommand.Model">
            <el-icon><ChatLineRound /></el-icon>
            <span>会话模型</span>
          </el-dropdown-item>
          <el-dropdown-item :command="DropdownCommand.Logout">
            <el-icon><IconLogout /></el-icon>
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-avatar class="my-header-avatar" v-else :size="40">登录</el-avatar>
  </header>
</template>

<style lang="scss" scoped>
.my-header {
  width: 100%;
  box-sizing: border-box;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.09);
  background-color: var(--my-white);
  display: flex;
  align-items: center;
  color: var(--my-black-mute);
  justify-content: space-between;
  > * {
    margin: 0 20px;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  .my-header-title {
    .my-header-title-logo {
      width: 40px;
      height: 40px;
    }
    .my-header-title-text {
      color: var(--my-gray-dark-1);
      font-size: 20px;
      font-weight: 600;
      margin-left: 10px;
      letter-spacing: 1px;
    }
  }
  .my-header-avatar {
    cursor: pointer;
  }
}

.my-header-dropdown {
  width: 120px;
  .my-header-nickname {
    font-size: 15px;
    margin: 5px 15px 10px;
    text-align: center;
    color: var(--my-gray-dark-1);
  }
}
</style>

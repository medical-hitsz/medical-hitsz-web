<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import IconLogout from "@/components/icons/IconLogout.vue";
import { useRouter } from "vue-router";

enum DropdownCommand {
  UserCenter,
  Logout,
}

const router = useRouter();
const userStore = useUserStore();
const { isLoggedIn, user } = storeToRefs(userStore);

const handleCommand = (command: DropdownCommand) => {
  switch (command) {
    case DropdownCommand.UserCenter:
      router.push("user-center");
      break;
    case DropdownCommand.Logout:
      userStore.logout();
      router.push("/login");
      break;
  }
};
</script>

<template>
  <header class="my-header">
    <router-link to="/">
      <h3 class="my-header-item">医疗会话</h3>
    </router-link>
    <el-dropdown v-if="isLoggedIn" @command="handleCommand">
      <el-avatar class="my-header-avatar" :size="40" :src="user.avatar" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :command="DropdownCommand.UserCenter">
            <el-icon><User /></el-icon>
            <span>个人中心</span>
          </el-dropdown-item>
          <el-dropdown-item :command="DropdownCommand.Logout" divided>
            <el-icon><IconLogout /></el-icon>
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-avatar v-else :size="40">登录</el-avatar>
  </header>
</template>

<style lang="scss" scoped>
.my-header {
  width: 100%;
  height: 60px;
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
  .my-header-item {
  }
  .my-header-avatar {
    cursor: pointer;
  }
}
</style>

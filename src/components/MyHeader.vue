<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import IconLogout from "@/components/icons/IconLogout.vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";

enum DropdownCommand {
  UserCenter,
  Logout,
}

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
    .catch();
};

const handleCommand = (command: DropdownCommand) => {
  switch (command) {
    case DropdownCommand.UserCenter:
      router.push("user-center");
      break;
    case DropdownCommand.Logout:
      logout();
      break;
  }
};
</script>

<template>
  <header class="my-header">
    <router-link to="/">
      <h3 class="my-header-item">TODO 医疗会话</h3>
    </router-link>
    <el-dropdown v-if="isLoggedIn" @command="handleCommand">
      <el-avatar class="my-header-avatar" :size="40" :src="user.avatar" />
      <template #dropdown>
        <el-dropdown-menu class="my-header-dropdown">
          <el-tooltip
            :content="`昵称：${user.nickname}`"
            placement="left"
            effect="light"
          >
            <div class="my-header-nickname">
              {{ user.nickname }}
            </div>
          </el-tooltip>
          <el-dropdown-item :command="DropdownCommand.UserCenter" divided>
            <el-icon><User /></el-icon>
            <span>个人中心</span>
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

.my-header-dropdown {
  width: 130px;
  .my-header-nickname {
    font-size: 15px;
    margin: 5px 15px 10px;
    text-align: center;
    color: var(--my-gray-dark-1);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

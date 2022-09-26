import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import userApi from "@/api/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Chat",
      component: () => import("@/views/ChatView.vue"),
      meta: {
        title: "主页",
      },
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        title: "用户登录",
      },
    },
    {
      path: "/user-center",
      name: "UserCenter",
      component: () => import("@/views/UserCenterView.vue"),
      meta: {
        title: "用户中心",
      },
    },
    {
      path: "/:pathMatch(.*)",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
      meta: {
        title: "页面未找到",
      },
    },
  ],
});

router.beforeEach(async (to) => {
  const store = useUserStore();
  if (typeof to.meta.title === "string") {
    document.title = `${to.meta.title} | 智能诊疗会话系统`;
  }

  if (to.name !== "Login" && !store.isLoggedIn) {
    try {
      const { data } = await userApi.autoLogin();
      store.login(data.user, data.authorization);
    } catch {
      return "/login";
    }
  }
});

export default router;

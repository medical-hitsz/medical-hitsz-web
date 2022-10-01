import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import userApi from "@/api/user";
import { uerAgentIsPC } from "@/utils/common";

const ChatView = uerAgentIsPC
  ? import("@/views/pc/ChatView.vue")
  : import("@/views/mobile/ChatView.vue");
const LoginView = uerAgentIsPC
  ? import("@/views/pc/LoginView.vue")
  : import("@/views/mobile/LoginView.vue");
const UserCenterView = uerAgentIsPC
  ? import("@/views/pc/UserCenterView.vue")
  : import("@/views/mobile/UserCenterView.vue");
const NotFoundView = uerAgentIsPC
  ? import("@/views/pc/NotFoundView.vue")
  : import("@/views/mobile/NotFoundView.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Chat",
      component: ChatView,
      meta: {
        title: "主页",
      },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: {
        title: "用户登录",
      },
    },
    {
      path: "/user-center",
      name: "UserCenter",
      component: UserCenterView,
      meta: {
        title: "用户中心",
      },
    },
    {
      path: "/:pathMatch(.*)",
      name: "NotFound",
      component: NotFoundView,
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

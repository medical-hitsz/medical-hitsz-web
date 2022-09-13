import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import userApi from "@/api/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/LoginView.vue"),
    },
    {
      path: "/user-center",
      name: "UserCenter",
      component: () => import("@/views/UserCenterView.vue"),
    },
    {
      path: "/not-found",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
    },
    {
      path: "/:pathMatch(.*)",
      name: "404",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const store = useUserStore();
  if (to.name !== "Login" && !store.isLoggedIn) {
    try {
      const { data } = await userApi.autoLogin();
      store.login(data.user, data.authorization);
    } catch {
      return { name: "Login" };
    }
  }
});

export default router;

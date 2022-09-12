import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/stores/user";
import userApi from "@/api/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
    },
  ],
});

router.beforeEach(async (to) => {
  const store = useUserStore();
  if (to.name !== "login" && !store.isLoggedIn) {
    try {
      const { data } = await userApi.autoLogin();
      store.login(data.user, data.authorization);
    } catch {
      return { name: "login" };
    }
  }
});

export default router;

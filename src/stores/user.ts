import type { User } from "@/types/user";
import {
  clearAuthorization,
  getAuthorization,
  setAuthorization,
} from "@/utils/authorization";
import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    isLoggedIn: false,
    user: { nickname: "", avatar: "" } as User,
    _authorization: "",
  }),
  getters: {
    authorization(state) {
      return state._authorization || getAuthorization();
    },
  },
  actions: {
    login(user: User, authorization: string) {
      this.user = user;
      this.isLoggedIn = true;
      this._authorization = authorization;
      setAuthorization(authorization);
    },
    logout() {
      this.user = { nickname: "", avatar: "" };
      this.isLoggedIn = false;
      this._authorization = "";
      clearAuthorization();
    },
  },
});

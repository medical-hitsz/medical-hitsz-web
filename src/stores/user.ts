import type { User } from "@/types/service";
import {
  clearStorage,
  getAuthorization,
  setAuthorization,
} from "@/utils/storage";
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
    setUserInfo(user: User) {
      this.user = user;
    },
    login(user: User, authorization: string) {
      clearStorage();
      this.user = user;
      this.isLoggedIn = true;
      this._authorization = authorization;
      setAuthorization(authorization);
    },
    logout() {
      this.user = { nickname: "", avatar: "" };
      this.isLoggedIn = false;
      this._authorization = "";
      clearStorage();
    },
  },
});

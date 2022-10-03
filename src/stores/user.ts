import type { User } from "@/types/service";
import {
  setStringStorage,
  getStringStorage,
  clearStorage,
} from "@/utils/storage";
import { defineStore } from "pinia";

const AUTHORIZATION_KEY = "__MEDICAL_HITSZ_AUTHORIZATION";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    isLoggedIn: false,
    user: { nickname: "", avatar: "" } as User,
    _authorization: "",
  }),
  getters: {
    authorization(state) {
      return state._authorization || getStringStorage(AUTHORIZATION_KEY);
    },
  },
  actions: {
    setUserInfo(user: User) {
      this.user = user;
    },
    login(user: User, authorization: string) {
      this.user = user;
      this.isLoggedIn = true;
      this._authorization = authorization;
      setStringStorage(AUTHORIZATION_KEY, authorization);
    },
    logout() {
      this.user = { nickname: "", avatar: "" };
      this.isLoggedIn = false;
      this._authorization = "";
      clearStorage();
    },
  },
});

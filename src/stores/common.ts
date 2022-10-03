import { defineStore } from "pinia";

export const useCommonStore = defineStore({
  id: "common",
  state: () => ({
    headerVisible: true,
    footerVisible: true,
  }),
  getters: {},
  actions: {
    setHeaderVisible(visible: boolean) {
      this.headerVisible = visible;
    },
    setFooterVisible(visible: boolean) {
      this.footerVisible = visible;
    },
  },
});

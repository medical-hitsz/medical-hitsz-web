import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import "element-plus/dist/index.css";
import "./styles/main.scss";
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(ElementPlus);
app.use(createPinia());
app.use(router);

app.mount("#app");

if (import.meta.env.MODE === "development") {
  console.log(import.meta.env);
}

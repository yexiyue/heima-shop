import { createSSRApp } from "vue";
import App from "./App.vue";
import {createPinia} from 'pinia'

export function createApp() {
  const app = createSSRApp(App);
  //使用pinia作为全局状态管理
  app.use(createPinia())
  return {
    app,
  };
}

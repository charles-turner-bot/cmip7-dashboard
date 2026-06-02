import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import "./style.css";
import App from "./App.vue";
import "@/composables/usePosthog";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  BiGithub,
  ViFileTypeTypescript,
  ViFileTypeVue,
} from "oh-vue-icons/icons";

addIcons(BiGithub, ViFileTypeTypescript, ViFileTypeVue);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.component("v-icon", OhVueIcon);

app.mount("#app");

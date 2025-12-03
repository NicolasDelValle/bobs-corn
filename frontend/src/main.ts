import { createApp } from "vue";
import { MotionPlugin } from "@vueuse/motion";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

import App from "./App.vue";
import router from "./router";

import "./style.css";
import "primeicons/primeicons.css";

const app = createApp(App);

app.use(router);
app.use(MotionPlugin);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount("#app");

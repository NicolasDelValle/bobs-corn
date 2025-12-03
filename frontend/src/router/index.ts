import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { setupGuards } from "./guards";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

setupGuards(router);

export default router;

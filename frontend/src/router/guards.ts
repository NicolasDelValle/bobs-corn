import type { Router } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { APP_ROUTES } from "./routes";

export function setupGuards(router: Router) {
  router.beforeEach((to, _, next) => {
    const { isAuthenticated } = useAuth();

    if (to.path === APP_ROUTES.LOGIN && isAuthenticated.value) {
      return next(APP_ROUTES.DASHBOARD);
    }

    if (to.meta.requiresAuth && !isAuthenticated.value) {
      return next(APP_ROUTES.LOGIN);
    }

    return next();
  });
}

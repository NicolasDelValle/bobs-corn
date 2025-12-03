import type { RouteRecordRaw } from "vue-router";
import { HomeView, DashboardView, LoginView } from "@/views";

export const APP_ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
};

export const routes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.HOME,
    name: "home",
    component: HomeView,
  },
  {
    path: APP_ROUTES.DASHBOARD,
    name: "dashboard",
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: APP_ROUTES.LOGIN,
    name: "login",
    component: LoginView,
  },
];

import type { RouteRecordRaw } from "vue-router";
import { HomePage, DashboardPage, LoginPage } from "@/pages";

export const APP_ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
};

export const routes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.HOME,
    name: "home",
    component: HomePage,
  },
  {
    path: APP_ROUTES.DASHBOARD,
    name: "dashboard",
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  {
    path: APP_ROUTES.LOGIN,
    name: "login",
    component: LoginPage,
  },
];

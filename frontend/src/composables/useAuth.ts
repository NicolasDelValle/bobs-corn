import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  isLoggedIn,
} from "@/services/authServices";
import type { LoginRequest } from "@/types/auth";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

const user = ref<AuthUser | null>(null);
const loading = ref(false);
const initialized = ref(false);

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = computed(() => user.value !== null);

  const initialize = async () => {
    if (initialized.value) return;

    loading.value = true;
    try {
      if (isLoggedIn()) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          user.value = currentUser;
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      user.value = null;
    } finally {
      loading.value = false;
      initialized.value = true;
    }
  };

  initialize();

  const login = async (credentials: LoginRequest) => {
    loading.value = true;
    try {
      const response = await loginService(credentials);
      user.value = response.user;
      return response;
    } catch (error) {
      user.value = null;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await logoutService();
    } finally {
      user.value = null;
      loading.value = false;

      router.push("/login");
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    initialize,
  };
}

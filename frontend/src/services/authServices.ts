import { apiPost, setAuthToken, clearAuthToken } from "@/lib/api";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/lib/const";
import { apiRoutes } from "@/lib/apiRoutes";
import type {
  LoginRequest,
  LoginResponse,
  ValidateTokenResponse,
} from "@/types/auth";

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiPost<LoginResponse>(
    apiRoutes.auth.login,
    credentials
  );

  setAuthToken(response.accessToken);
  storage.set(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
  storage.set(STORAGE_KEYS.USER, response.user);

  return response;
};

export const logout = async (): Promise<void> => {
  try {
    await apiPost(apiRoutes.auth.logout);
  } catch {
    return;
  } finally {
    clearAuthToken();
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    storage.remove(STORAGE_KEYS.USER);
  }
};

export const validateToken =
  async (): Promise<ValidateTokenResponse | null> => {
    try {
      const result = await apiPost<ValidateTokenResponse>(
        apiRoutes.auth.validate
      );
      return result;
    } catch {
      clearAuthToken();
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER);
      return null;
    }
  };

export const getCurrentUser = (): LoginResponse["user"] | null => {
  return storage.get(STORAGE_KEYS.USER);
};

export const isLoggedIn = (): boolean => {
  const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
  const user = getCurrentUser();
  return !!(token && user);
};

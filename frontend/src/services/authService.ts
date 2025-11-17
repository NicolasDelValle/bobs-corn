import { apiPost, setAuthToken, clearAuthToken } from "@/lib/api";
import { storage, STORAGE_KEYS } from "@/utils/storage";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ValidateTokenResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiPost<LoginResponse>("/auth/login", credentials);

  setAuthToken(response.accessToken);
  storage.set(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
  storage.set(STORAGE_KEYS.USER, response.user);

  return response;
};

export const logout = async (): Promise<void> => {
  try {
    await apiPost("/auth/logout");
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
      const result = await apiPost<ValidateTokenResponse>("/auth/validate");
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

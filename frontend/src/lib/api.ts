import { storage } from "@/utils/storage";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const baseFetch = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const sessionId = storage.get("bobscorn_session_id");
  const token = storage.get("authToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (sessionId && typeof sessionId === "string") {
    headers["x-session-id"] = sessionId;
  }

  if (token && typeof token === "string") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    storage.remove("authToken");
  }

  return response;
};

export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const response = await baseFetch(endpoint, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
};

export const apiPost = async <T>(
  endpoint: string,
  data?: unknown
): Promise<T> => {
  const response = await baseFetch(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
};

export const apiPut = async <T>(
  endpoint: string,
  data?: unknown
): Promise<T> => {
  const response = await baseFetch(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
};

export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const response = await baseFetch(endpoint, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
};

export const setAuthToken = (token: string): void => {
  storage.set("authToken", token);
};

export const clearAuthToken = (): void => {
  storage.remove("authToken");
};

export const getAuthToken = (): string | null => {
  return storage.get("authToken");
};

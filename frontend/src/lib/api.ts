import { storage } from "@/utils/storage";

// Configuración base de la API
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Función base para hacer fetch con headers personalizados
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

  // Agregar session ID si existe
  if (sessionId && typeof sessionId === "string") {
    headers["x-session-id"] = sessionId;
  }

  // Agregar token de autorización si existe
  if (token && typeof token === "string") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // Manejar errores de autenticación
  if (response.status === 401) {
    // Token expirado o inválido
    localStorage.removeItem("authToken");
    // Opcional: redirigir a login
    // window.location.href = '/login';
  }

  return response;
};

// Función para GET requests
export const apiGet = async <T>(endpoint: string): Promise<T> => {
  const response = await baseFetch(endpoint, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
};

// Función para POST requests
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

// Función para PUT requests
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

// Función para DELETE requests
export const apiDelete = async <T>(endpoint: string): Promise<T> => {
  const response = await baseFetch(endpoint, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
  }

  return response.json();
};

// Función para autenticación
export const setAuthToken = (token: string): void => {
  storage.set("authToken", token);
};

export const clearAuthToken = (): void => {
  storage.remove("authToken");
};

export const getAuthToken = (): string | null => {
  return storage.get("authToken");
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiRoutes = {
  auth: {
    login: `${API_BASE}/api/auth/login`,
    logout: `${API_BASE}/api/auth/logout`,
    refresh: `${API_BASE}/api/auth/refresh`,
    me: `${API_BASE}/api/auth/me`,
    validate: `${API_BASE}/api/auth/validate`,
  },
  purchases: {
    list: `${API_BASE}/api/purchases`,
    detail: (id: string) => `${API_BASE}/api/purchases/${id}`,
    create: `${API_BASE}/api/purchases`,
    update: (id: string) => `${API_BASE}/api/purchases/${id}`,
    delete: (id: string) => `${API_BASE}/api/purchases/${id}`,
  },
  products: {
    list: `${API_BASE}/api/products`,
    detail: (id: string) => `${API_BASE}/api/products/${id}`,
    create: `${API_BASE}/api/products`,
    update: (id: string) => `${API_BASE}/api/products/${id}`,
    delete: (id: string) => `${API_BASE}/api/products/${id}`,
  },
  users: {
    list: `${API_BASE}/api/users`,
    detail: (id: string) => `${API_BASE}/api/users/${id}`,
    create: `${API_BASE}/api/users`,
    update: (id: string) => `${API_BASE}/api/users/${id}`,
    delete: (id: string) => `${API_BASE}/api/users/${id}`,
  },
};

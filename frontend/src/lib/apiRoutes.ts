const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiRoutes = {
  auth: {
    login: `${API_BASE}/auth/login`,
    logout: `${API_BASE}/auth/logout`,
    refresh: `${API_BASE}/auth/refresh`,
    me: `${API_BASE}/auth/me`,
    validate: `${API_BASE}/auth/validate`,
  },
  purchases: {
    list: `${API_BASE}/purchases`,
    detail: (id: string) => `${API_BASE}/purchases/${id}`,
    create: `${API_BASE}/purchases`,
    update: (id: string) => `${API_BASE}/purchases/${id}`,
  },
  products: {
    list: `${API_BASE}/products`,
    get: (id: string) => `${API_BASE}/products/${id}`,
    update: (id: string) => `${API_BASE}/products/${id}`,
  },
  common: {
    purchaseWaitTime: `${API_BASE}/common/purchase-wait-time`,
    paymentTypes: {
      list: `${API_BASE}/common/payment-types`,
      create: `${API_BASE}/common/payment-types`,
      update: (id: string) => `${API_BASE}/common/payment-types/${id}`,
      delete: (id: string) => `${API_BASE}/common/payment-types/${id}`,
      seed: `${API_BASE}/common/seed-payment-types`,
    },
  },
};

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
  },
  common: {
    purchaseWaitTime: `${API_BASE}/api/common/purchase-wait-time`,
    paymentTypes: {
      list: `${API_BASE}/api/common/payment-types`,
      create: `${API_BASE}/api/common/payment-types`,
      update: (id: string) => `${API_BASE}/api/common/payment-types/${id}`,
      delete: (id: string) => `${API_BASE}/api/common/payment-types/${id}`,
      seed: `${API_BASE}/api/common/seed-payment-types`,
    },
  },
};

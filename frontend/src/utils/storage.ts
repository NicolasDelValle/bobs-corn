export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item);
    } catch {
      return defaultValue || null;
    }
  },

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },

  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  },

  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  },
};

export const STORAGE_KEYS = {
  SESSION_ID: "bobscorn_session_id",
  SESSION_NAME: "bobscorn_session_name",
  CORN_COUNT: "bobscorn_corn_count",
  WAIT_TIME: "bobscorn_wait_time",
  LAST_PURCHASE: "bobscorn_last_purchase",
  LAST_PURCHASED_PRODUCT: "bobscorn_last_purchased_product",
  USER_PREFERENCES: "bobscorn_preferences",
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;

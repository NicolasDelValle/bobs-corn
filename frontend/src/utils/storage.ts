/**
 * Utilities para localStorage con manejo de errores
 */

export const storage = {
  // Obtener un valor del localStorage
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  },

  // Guardar un valor en localStorage
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  // Remover un valor del localStorage
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  // Limpiar todo el localStorage
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn("Error clearing localStorage:", error);
      return false;
    }
  },

  // Verificar si existe una key
  exists(key: string): boolean {
    return localStorage.getItem(key) !== null;
  },
};

// Keys específicas para la app
export const STORAGE_KEYS = {
  SESSION_ID: "bobscorn_session_id",
  WAIT_TIME: "bobscorn_wait_time",
  LAST_PURCHASE: "bobscorn_last_purchase",
  USER_PREFERENCES: "bobscorn_preferences",
} as const;

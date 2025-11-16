/**
 * Utilidades para gestión de sesión
 */

// Generar un ID de sesión único
export const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `bobscorn_${timestamp}_${randomPart}`;
};

// Obtener la fecha actual en formato ISO
export const getCurrentTimestamp = (): number => {
  return Date.now();
};

// Formatear tiempo en formato MM:SS
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

// Calcular tiempo restante desde un timestamp
export const calculateRemainingTime = (
  startTime: number,
  durationMinutes: number
): number => {
  const elapsed = Date.now() - startTime;
  const totalMs = durationMinutes * 60 * 1000;
  const remaining = Math.max(0, totalMs - elapsed);
  return Math.floor(remaining / 1000); // retorna segundos
};

// Verificar si el tiempo de espera ha expirado
export const hasWaitTimeExpired = (
  startTime: number,
  durationMinutes: number
): boolean => {
  const elapsed = Date.now() - startTime;
  const totalMs = durationMinutes * 60 * 1000;
  return elapsed >= totalMs;
};

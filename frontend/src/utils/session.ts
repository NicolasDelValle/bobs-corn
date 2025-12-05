export const generateSessionId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `bobscorn_${timestamp}_${randomPart}`;
};

export const getCurrentTimestamp = (): number => {
  return Date.now();
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const calculateRemainingTime = (
  startTime: number,
  durationSeconds: number,
  currentTime: number = Date.now() // ✅ Parámetro opcional
): number => {
  const elapsed = currentTime - startTime;
  const totalMs = durationSeconds * 1000;

  const remaining = Math.max(0, totalMs - elapsed);
  return Math.floor(remaining / 1000);
};

export const hasWaitTimeExpired = (
  startTime: number,
  durationMinutes: number,
  currentTime: number = Date.now() // ✅ Parámetro opcional
): boolean => {
  const elapsed = currentTime - startTime;
  const totalMs = durationMinutes * 1000;
  return elapsed >= totalMs;
};

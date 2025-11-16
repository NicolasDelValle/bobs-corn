/**
 * Application configuration
 * Environment variables and app settings
 */

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const config = {
  api: {
    baseUrl: API_URL,
    timeout: 10000,
  },
  app: {
    name: "Bob's Corn",
    version: "1.0.0",
  },
} as const;

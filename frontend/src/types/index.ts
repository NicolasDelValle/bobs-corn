/**
 * Global TypeScript types for the application
 */

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Common props for components
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Environment variables declaration
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly NODE_ENV: string;
  }
}

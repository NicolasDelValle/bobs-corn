export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly NODE_ENV: string;
  }
}

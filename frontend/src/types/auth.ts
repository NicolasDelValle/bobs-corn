export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ValidateTokenResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

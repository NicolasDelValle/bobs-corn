import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  login as loginService,
  logout as logoutService,
  getCurrentUser,
  isLoggedIn,
  type LoginRequest,
} from "@/services/authService";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);

      if (isLoggedIn()) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setLoading(true);
    try {
      const response = await loginService(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutService();
    } catch {
      alert("Error al cerrar sesión. Por favor, intente de nuevo.");
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };
};

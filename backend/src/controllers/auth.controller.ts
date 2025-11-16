import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        error: "Missing credentials",
        message: "Email and password are required",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        error: "Invalid email format",
        message: "Please provide a valid email address",
      });
      return;
    }

    // Attempt login
    const result = await AuthService.login(email.toLowerCase(), password);

    if (!result) {
      res.status(401).json({
        error: "Invalid credentials",
        message: "Email or password is incorrect",
      });
      return;
    }

    res.status(200).json({
      message: "Login successful",
      user: result.user,
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Login failed",
      message: "Internal server error during login",
    });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        error: "Missing refresh token",
        message: "Refresh token is required",
      });
      return;
    }

    const newTokens = await AuthService.refreshTokens(refreshToken);

    if (!newTokens) {
      res.status(401).json({
        error: "Invalid refresh token",
        message: "Refresh token is invalid or expired",
      });
      return;
    }

    res.status(200).json({
      message: "Tokens refreshed successfully",
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      error: "Token refresh failed",
      message: "Internal server error during token refresh",
    });
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    await AuthService.logout(req.sessionId);

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      error: "Logout failed",
      message: "Internal server error during logout",
    });
  }
};

export const me = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      message: "User profile retrieved successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Profile retrieval failed",
      message: "Internal server error during profile retrieval",
    });
  }
};

export const validateToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      message: "Token is valid",
      user: req.user,
    });
  } catch (error) {
    console.error("Validate token error:", error);
    res.status(500).json({
      error: "Token validation failed",
      message: "Internal server error during token validation",
    });
  }
};

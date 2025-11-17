import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  sessionId: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "Authorization header missing or invalid format",
        message: "Please provide a valid Bearer token",
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      res.status(401).json({
        error: "Token missing",
        message: "Please provide a valid access token",
      });
      return;
    }

    const sessionData = await AuthService.validateSession(token);

    if (!sessionData) {
      res.status(401).json({
        error: "Invalid or expired token",
        message: "Please login again",
      });
      return;
    }

    (req as AuthenticatedRequest).user = sessionData.user;
    (req as AuthenticatedRequest).sessionId = sessionData.sessionId;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      error: "Authentication error",
      message: "Internal server error during authentication",
    });
  }
};

export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);

      if (token) {
        const sessionData = await AuthService.validateSession(token);

        if (sessionData) {
          (req as AuthenticatedRequest).user = sessionData.user;
          (req as AuthenticatedRequest).sessionId = sessionData.sessionId;
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
};

import { Router } from "express";
import {
  login,
  refreshToken,
  logout,
  me,
  validateToken,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/refresh", refreshToken);

// Protected routes
router.post("/logout", authMiddleware, logout as any);
router.get("/me", authMiddleware, me as any);
router.get("/validate", authMiddleware, validateToken as any);

export default router;

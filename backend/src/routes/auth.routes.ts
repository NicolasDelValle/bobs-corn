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

router.post("/login", login);
router.post("/refresh", refreshToken);

router.post("/logout", authMiddleware, logout as any);
router.get("/me", authMiddleware, me as any);
router.get("/validate", authMiddleware, validateToken as any);

export default router;

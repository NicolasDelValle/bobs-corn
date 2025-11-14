import { Router } from "express";
import {
  getPurchases,
  getPurchaseById,
  createPurchase,
} from "../controllers/purchase.controller";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get("/", getPurchases);
router.get("/:id", getPurchaseById);
router.post("/", rateLimiter, createPurchase);

export default router;

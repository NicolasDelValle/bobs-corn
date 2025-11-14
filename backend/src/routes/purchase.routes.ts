import { Router } from "express";
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
} from "../controllers/purchase.controller";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.get("/", getAllPurchases);
router.get("/:id", getPurchaseById);
router.post("/", rateLimiter, createPurchase);

export default router;

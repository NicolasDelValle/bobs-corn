import { Router } from "express";
import { getApiInfo } from "../controllers/health.controller";
import purchaseRoutes from "./purchase.routes";
import paymentMethodRoutes from "./paymentMethod.routes";
import authRoutes from "./auth.routes";
import paymentRoutes from "./payment.routes";
import configRoutes from "./config.routes";
import { productRoutes } from "./product.routes";

const router = Router();

router.get("/", getApiInfo);
router.use("/auth", authRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/payment-methods", paymentMethodRoutes);
router.use("/products", productRoutes);
router.use("/payments", paymentRoutes);
router.use("/config", configRoutes);

export default router;

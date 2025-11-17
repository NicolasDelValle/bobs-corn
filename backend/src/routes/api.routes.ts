import { Router } from "express";
import { getApiInfo } from "../controllers/health.controller";
import purchaseRoutes from "./purchase.routes";
import paymentMethodRoutes from "./paymentMethod.routes";
import authRoutes from "./auth.routes";
import commonRoutes from "./common.routes";
import { productRoutes } from "./product.routes";

const router = Router();

router.get("/", getApiInfo);
router.use("/auth", authRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/payment-methods", paymentMethodRoutes);
router.use("/products", productRoutes);
router.use("/common", commonRoutes);

export default router;

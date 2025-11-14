import { Router } from "express";
import { getApiInfo } from "../controllers/health.controller";
import exampleRoutes from "./example.routes";
import purchaseRoutes from "./purchase.routes";
import paymentMethodRoutes from "./paymentMethod.routes";

const router = Router();

router.get("/", getApiInfo);
router.use("/hello", exampleRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/payment-methods", paymentMethodRoutes);

export default router;

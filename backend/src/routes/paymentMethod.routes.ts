import { Router } from "express";
import {
  getAllPaymentMethods,
  getPaymentMethodById,
  createPaymentMethod,
} from "../controllers/paymentMethod.controller";

const router = Router();

router.get("/", getAllPaymentMethods);
router.get("/:id", getPaymentMethodById);
router.post("/", createPaymentMethod);

export default router;

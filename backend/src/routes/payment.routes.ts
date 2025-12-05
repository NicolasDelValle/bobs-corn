import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

const router = Router();

router.get("/types", PaymentController.getPaymentTypes);
router.post("/types", PaymentController.createPaymentType);
router.put("/types/:id", PaymentController.updatePaymentType);
router.delete("/types/:id", PaymentController.deletePaymentType);

router.post("/seed-types", PaymentController.seedPaymentTypes);

export default router;

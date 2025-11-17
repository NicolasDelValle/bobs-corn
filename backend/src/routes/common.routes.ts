import { Router } from "express";
import { CommonController } from "../controllers/common.controller";

const router = Router();

router.get("/purchase-wait-time", CommonController.getPurchaseWaitTime);
router.put("/purchase-wait-time", CommonController.setPurchaseWaitTime);

router.get("/payment-types", CommonController.getPaymentTypes);
router.post("/payment-types", CommonController.createPaymentType);
router.put("/payment-types/:id", CommonController.updatePaymentType);
router.delete("/payment-types/:id", CommonController.deletePaymentType);

router.post("/seed-payment-types", CommonController.seedPaymentTypes);

export default router;

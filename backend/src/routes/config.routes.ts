import { Router } from "express";
import { ConfigController } from "../controllers/config.controller";

const router = Router();

router.get("/purchase-wait-time", ConfigController.getPurchaseWaitTime);
router.put("/purchase-wait-time", ConfigController.setPurchaseWaitTime);

export default router;

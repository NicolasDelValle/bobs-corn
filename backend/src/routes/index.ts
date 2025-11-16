import { Router } from "express";
import { getHealth } from "../controllers/health.controller";
import apiRoutes from "./api.routes";

const router = Router();

router.get("/health", getHealth);
router.use("/api", apiRoutes);

export default router;

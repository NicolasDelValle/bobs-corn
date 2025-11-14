import { Router } from "express";
import { getApiInfo } from "../controllers/health.controller";
import exampleRoutes from "./example.routes";

const router = Router();

router.get("/", getApiInfo);
router.use("/hello", exampleRoutes);

export default router;

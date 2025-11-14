import { Router } from "express";
import { getHello } from "../controllers/example.controller";

const router = Router();

router.get("/", getHello);

export default router;

import type { Request, Response } from "express";
import { config } from "../lib/config";

export const getHealth = (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.app.env,
    version: config.app.version,
  });
};

export const getApiInfo = (_req: Request, res: Response) => {
  res.json({
    name: config.app.name,
    version: config.app.version,
    environment: config.app.env,
    message: "Bob's Corn API is running!",
  });
};

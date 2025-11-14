import type { Request, Response, NextFunction } from "express";
import { config } from "../lib/config";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource does not exist",
  });
};

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Error:", err);

  res.status(500).json({
    error: "Internal Server Error",
    message: config.app.isDevelopment
      ? err.message
      : "An unexpected error occurred",
  });
};

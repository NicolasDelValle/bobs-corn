import type { Request, Response } from "express";

export const getHello = (_req: Request, res: Response) => {
  res.json({
    message: "Hello from Bob's Corn API!",
    timestamp: new Date().toISOString(),
  });
};

import type { Request, Response } from "express";
import { CommonService } from "../services/common.service";

export class ConfigController {
  static async getPurchaseWaitTime(req: Request, res: Response) {
    try {
      const waitTime = await CommonService.getPurchaseWaitTime();
      res.json({ waitTime });
    } catch (error) {
      console.error("Error getting purchase wait time:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async setPurchaseWaitTime(req: Request, res: Response) {
    try {
      const { minutes } = req.body;

      if (!minutes || typeof minutes !== "number" || minutes <= 0) {
        return res
          .status(400)
          .json({ error: "Minutos debe ser un número mayor a 0" });
      }

      await CommonService.setPurchaseWaitTime(minutes);
      res.json({ message: "Tiempo de espera actualizado exitosamente" });
    } catch (error) {
      console.error("Error setting purchase wait time:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

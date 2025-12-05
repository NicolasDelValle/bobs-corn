import type { Request, Response } from "express";
import { CommonService } from "../services/common.service";

export class PaymentController {
  static async getPaymentTypes(req: Request, res: Response) {
    try {
      const paymentTypes = await CommonService.getPaymentTypes();
      res.json(paymentTypes);
    } catch (error) {
      console.error("Error getting payment types:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async createPaymentType(req: Request, res: Response) {
    try {
      const { name, displayName, icon, order } = req.body;

      if (!name || !displayName || !icon) {
        return res.status(400).json({
          error: "name, displayName e icon son requeridos",
        });
      }

      const paymentType = await CommonService.createPaymentType({
        name,
        displayName,
        icon,
        order,
      });

      res.status(201).json(paymentType);
    } catch (error) {
      console.error("Error creating payment type:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async updatePaymentType(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID es requerido" });
      }

      const { name, displayName, icon, isEnabled, order } = req.body;

      const paymentType = await CommonService.updatePaymentType(id, {
        name,
        displayName,
        icon,
        isEnabled,
        order,
      });

      res.json(paymentType);
    } catch (error) {
      console.error("Error updating payment type:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  static async deletePaymentType(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID es requerido" });
      }

      await CommonService.deletePaymentType(id);
      res.json({ message: "Método de pago eliminado exitosamente" });
    } catch (error) {
      console.error("Error deleting payment type:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();

// GET /api/products - Obtener todos los productos
router.get("/", ProductController.getAllProducts);

// GET /api/products/:id - Obtener un producto por ID
router.get("/:id", ProductController.getProductById);

// PUT /api/products/:id - Actualizar un producto
router.put("/:id", ProductController.updateProduct);

export { router as productRoutes };

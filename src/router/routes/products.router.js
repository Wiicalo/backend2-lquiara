import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";
import { requireJwtCookie, authorizeRoles } from "../middleware/auth.middleware.js";

const productsRouter = Router();

productsRouter.get("/", productsController.list);
productsRouter.get("/:pid", productsController.getById);
productsRouter.post("/", requireJwtCookie, authorizeRoles("admin"), productsController.create);
productsRouter.put("/:pid", requireJwtCookie, authorizeRoles("admin"), productsController.update);
productsRouter.delete("/:pid", requireJwtCookie, authorizeRoles("admin"), productsController.remove);

export default productsRouter;

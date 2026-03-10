import { Router } from "express";
import { cartsController } from "../controllers/carts.controller.js";
import { requireJwtCookie, authorizeRoles } from "../middleware/auth.middleware.js";

const cartsRouter = Router();

cartsRouter.post("/", requireJwtCookie, cartsController.create);
cartsRouter.get("/:cid", requireJwtCookie, cartsController.getById);

cartsRouter.post("/:cid/product/:pid", requireJwtCookie, authorizeRoles("user"), cartsController.addProduct);
cartsRouter.delete("/:cid/product/:pid", requireJwtCookie, authorizeRoles("user"), cartsController.removeProduct);
cartsRouter.put("/:cid/product/:pid", requireJwtCookie, authorizeRoles("user"), cartsController.updateProductQuantity);
cartsRouter.delete("/:cid", requireJwtCookie, authorizeRoles("user"), cartsController.clear);
cartsRouter.post("/:cid/purchase", requireJwtCookie, authorizeRoles("user"), cartsController.purchase);

export default cartsRouter;

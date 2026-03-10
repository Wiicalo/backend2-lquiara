import { cartService } from "../services/cart.service.js";

export class CartsController {
    async create(req, res) {
        const cart = await cartService.create();
        res.status(201).send({ status: "success", cart });
    }

    async getById(req, res) {
        const cart = await cartService.getById(req.params.cid);
        if (!cart) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        res.send({ status: "success", cart });
    }

    async addProduct(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updated = await cartService.addProduct(cid, pid, Number(quantity || 1));
        if (!updated) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        res.send({ status: "success", cart: updated });
    }

    async removeProduct(req, res) {
        const { cid, pid } = req.params;
        const updated = await cartService.removeProduct(cid, pid);
        if (!updated) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        res.send({ status: "success", cart: updated });
    }

    async updateProductQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updated = await cartService.updateProductQuantity(cid, pid, Number(quantity || 1));
        if (!updated) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        res.send({ status: "success", cart: updated });
    }

    async clear(req, res) {
        const updated = await cartService.clear(req.params.cid);
        if (!updated) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        res.send({ status: "success", cart: updated });
    }

    async purchase(req, res) {
        const { cid } = req.params;
        const purchaserEmail = req.user?.email;
        if (!purchaserEmail) {
            return res.status(401).send({ status: "error", error: "No autorizado" });
        }
        const result = await cartService.purchase(cid, purchaserEmail);
        if (!result) return res.status(404).send({ status: "error", error: "Carrito no encontrado" });
        res.send({ status: "success", ticket: result.ticket, notPurchased: result.notPurchased });
    }
}

export const cartsController = new CartsController();

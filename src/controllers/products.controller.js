import { productService } from "../services/product.service.js";

export class ProductsController {
    async list(req, res) {
        const products = await productService.list();
        res.send({ status: "success", products });
    }

    async getById(req, res) {
        const product = await productService.getById(req.params.pid);
        if (!product) return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        res.send({ status: "success", product });
    }

    async create(req, res) {
        const created = await productService.create(req.body);
        res.status(201).send({ status: "success", product: created });
    }

    async update(req, res) {
        const updated = await productService.update(req.params.pid, req.body);
        if (!updated) return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        res.send({ status: "success", product: updated });
    }

    async remove(req, res) {
        const removed = await productService.remove(req.params.pid);
        if (!removed) return res.status(404).send({ status: "error", error: "Producto no encontrado" });
        res.send({ status: "success", message: "Producto eliminado" });
    }
}

export const productsController = new ProductsController();

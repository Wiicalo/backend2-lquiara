import { ProductDAO } from "../../dao/product.dao.js";

export class ProductRepository {
    constructor(dao = new ProductDAO()) { this.dao = dao; }
    async list(filter = {}, options = {}) { return await this.dao.getAll(filter, options); }
    async getById(id) { return await this.dao.getById(id); }
    async create(data) { return await this.dao.create(data); }
    async update(id, data) { return await this.dao.updateById(id, data); }
    async remove(id) { return await this.dao.deleteById(id); }
}

export const productRepository = new ProductRepository();

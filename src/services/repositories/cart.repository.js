import { CartDAO } from "../../dao/cart.dao.js";

export class CartRepository {
    constructor(dao = new CartDAO()) { this.dao = dao; }
    async create(data = {}) { return await this.dao.create(data); }
    async getById(id) { return await this.dao.getById(id); }
    async getByIdPopulated(id) { return await this.dao.getByIdPopulated(id); }
    async update(id, data) { return await this.dao.updateById(id, data); }
    async remove(id) { return await this.dao.deleteById(id); }
}

export const cartRepository = new CartRepository();

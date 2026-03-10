import { BaseDAO } from "./base.dao.js";
import { Cart } from "../config/models/cart.model.js";

export class CartDAO extends BaseDAO {
    constructor() { super(Cart); }

    async getByIdPopulated(id) {
        return await this.model.findById(id).populate("products.product").lean();
    }
}

import { BaseDAO } from "./base.dao.js";
import { Product } from "../config/models/product.model.js";

export class ProductDAO extends BaseDAO {
    constructor() { super(Product); }
}

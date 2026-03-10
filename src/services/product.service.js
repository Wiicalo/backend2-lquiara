import { productRepository } from "./repositories/product.repository.js";

export class ProductService {
    constructor(repo = productRepository) { this.repo = repo; }
    async list() { return await this.repo.list(); }
    async getById(id) { return await this.repo.getById(id); }
    async create(data) { return await this.repo.create(data); }
    async update(id, data) { return await this.repo.update(id, data); }
    async remove(id) { return await this.repo.remove(id); }
}

export const productService = new ProductService();

import crypto from "crypto";
import { cartRepository } from "./repositories/cart.repository.js";
import { productRepository } from "./repositories/product.repository.js";
import { ticketRepository } from "./repositories/ticket.repository.js";

export class CartService {
    constructor(cartRepo = cartRepository, productRepo = productRepository, ticketRepo = ticketRepository) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
        this.ticketRepo = ticketRepo;
    }

    async create() { return await this.cartRepo.create({ products: [] }); }
    async getById(id) { return await this.cartRepo.getByIdPopulated(id); }

    async addProduct(cartId, productId, quantity = 1) {
        const cart = await this.cartRepo.getById(cartId);
        if (!cart) return null;
        const existing = cart.products.find(p => String(p.product) === String(productId));
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        return await this.cartRepo.update(cartId, { products: cart.products });
    }

    async removeProduct(cartId, productId) {
        const cart = await this.cartRepo.getById(cartId);
        if (!cart) return null;
        const products = cart.products.filter(p => String(p.product) !== String(productId));
        return await this.cartRepo.update(cartId, { products });
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.cartRepo.getById(cartId);
        if (!cart) return null;
        const products = cart.products.map(p => {
            if (String(p.product) === String(productId)) {
                return { ...p, quantity };
            }
            return p;
        });
        return await this.cartRepo.update(cartId, { products });
    }

    async clear(cartId) {
        const cart = await this.cartRepo.getById(cartId);
        if (!cart) return null;
        return await this.cartRepo.update(cartId, { products: [] });
    }

    async purchase(cartId, purchaserEmail) {
        const cart = await this.cartRepo.getByIdPopulated(cartId);
        if (!cart) return null;

        const purchased = [];
        const notPurchased = [];
        let amount = 0;

        for (const item of cart.products) {
            const product = item.product;
            if (!product) continue;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await this.productRepo.update(product._id, { stock: product.stock });
                purchased.push(item);
                amount += product.price * item.quantity;
            } else {
                notPurchased.push(item);
            }
        }

        await this.cartRepo.update(cartId, {
            products: notPurchased.map(p => ({ product: p.product._id || p.product, quantity: p.quantity }))
        });

        if (purchased.length === 0) {
            return { ticket: null, notPurchased };
        }

        const ticket = await this.ticketRepo.create({
            code: crypto.randomUUID(),
            amount,
            purchaser: purchaserEmail
        });

        return { ticket, notPurchased };
    }
}

export const cartService = new CartService();

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
            quantity: { type: Number, required: true, min: 1, default: 1 }
        }
    ]
}, { timestamps: true });

export const Cart = mongoose.model("carts", cartSchema);

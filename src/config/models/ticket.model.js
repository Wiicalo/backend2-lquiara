import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true, min: 0 },
    purchaser: { type: String, required: true, trim: true, lowercase: true }
}, { timestamps: true });

export const Ticket = mongoose.model("tickets", ticketSchema);

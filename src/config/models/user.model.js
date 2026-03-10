import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true // Se encriptará antes de guardar
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts' // Asegúrate de que 'carts' sea el nombre de tu colección de carritos
    },
    role: {
        type: String,
        enum: ["user", "seller", "admin"], // Roles permitidos
        default: "user"
    }
}, { timestamps: true });

export const User = mongoose.model('users', userSchema);

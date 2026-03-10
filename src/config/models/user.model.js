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
        required: true 
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
        ref: 'carts' 
    },
    role: {
        type: String,
        enum: ["user", "seller", "admin"], 
        default: "user"
    }
}, { timestamps: true });

export const User = mongoose.model('users', userSchema);

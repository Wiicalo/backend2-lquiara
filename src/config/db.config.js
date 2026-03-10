import mongoose from "mongoose";
import { environment } from "./env.config.js";

const baseOptions = {
    autoIndex: true,
};

export async function connectDB() {
    if (!environment.MONGO_URL) {
        throw new Error("MONGO_URL no configurado");
    }
    await mongoose.connect(environment.MONGO_URL, baseOptions);
    return mongoose.connection;
}

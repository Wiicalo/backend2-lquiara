import crypto from "crypto";
import { userRepository } from "./repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";

export class AuthService {
    constructor(userRepo = userRepository) { this.userRepo = userRepo; }

    async createResetToken(email) {
        const user = await this.userRepo.getByEmail(email);
        if (!user) return null;

        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
        const expires = new Date(Date.now() + 60 * 60 * 1000);

        await this.userRepo.update(user._id, {
            resetPasswordToken: tokenHash,
            resetPasswordExpires: expires
        });

        return { rawToken, user };
    }

    async resetPassword({ userId, token, newPassword }) {
        const user = await this.userRepo.getById(userId);
        if (!user || !user.resetPasswordToken || !user.resetPasswordExpires) {
            return { ok: false, reason: "Token invalido" };
        }

        if (new Date(user.resetPasswordExpires) < new Date()) {
            return { ok: false, reason: "Token expirado" };
        }

        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        if (tokenHash !== user.resetPasswordToken) {
            return { ok: false, reason: "Token invalido" };
        }

        if (isValidPassword(user, newPassword)) {
            return { ok: false, reason: "No puedes usar la misma contraseña" };
        }

        const hashed = createHash(newPassword);
        await this.userRepo.update(user._id, {
            password: hashed,
            passwordChangedAt: new Date(),
            resetPasswordToken: null,
            resetPasswordExpires: null
        });

        return { ok: true };
    }
}

export const authService = new AuthService();

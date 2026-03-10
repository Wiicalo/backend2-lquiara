import nodemailer from "nodemailer";
import { environment } from "../config/env.config.js";

function buildTransport() {
    if (!environment.SMTP_HOST) throw new Error("SMTP_HOST no configurado");
    return nodemailer.createTransport({
        host: environment.SMTP_HOST,
        port: Number(environment.SMTP_PORT || 587),
        secure: String(environment.SMTP_SECURE || "false") === "true",
        auth: { user: environment.SMTP_USER, pass: environment.SMTP_PASS }
    });
}

export class MailerService {
    async sendResetPasswordEmail({ to, link }) {
        if (!to || !link) throw new Error("Faltan campos obligatorios");
        const transport = buildTransport();
        const html = `
            <div>
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p>Haz click en el boton para continuar. El enlace expira en 1 hora.</p>
                <p><a href="${link}" target="_blank" rel="noopener">Restablecer contraseña</a></p>
            </div>
        `;
        const info = await transport.sendMail({
            from: environment.SMTP_FROM || environment.SMTP_USER,
            to,
            subject: "Recuperacion de contraseña",
            html
        });
        return { messageId: info.messageId, accepted: info.accepted, rejected: info.rejected };
    }
}

export const mailerService = new MailerService();

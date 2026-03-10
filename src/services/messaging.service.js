import twilio from "twilio";
import { environment } from "../config/env.config.js";

const client = (environment.TWILIO_ACCOUNT_SID && environment.TWILIO_AUTH_TOKEN)
    ? twilio(environment.TWILIO_ACCOUNT_SID, environment.TWILIO_AUTH_TOKEN)
    : null;

export class MessagingService {
    #client;
    constructor(twilioClient = client) { this.#client = twilioClient; }
    #assert() { if (!this.#client) throw new Error("Twilio no configurado"); }

    async sendSMS({ to, body }) {
        this.#assert();
        if (!to || !body) throw new Error("Faltan campos to o body");
        if (!environment.TWILIO_FROM_SMS) throw new Error("TWILIO_FROM_SMS no configurado");
        const m = await this.#client.messages.create({ from: environment.TWILIO_FROM_SMS, to, body });
        return { sid: m.sid, status: m.status };
    }

    async sendWhatsApp({ to, body }) {
        this.#assert();
        if (!to || !body) throw new Error("Faltan campos obligatorios");
        if (!environment.TWILIO_FROM_WAPP) throw new Error("TWILIO_FROM_WAPP no configurado");
        const m = await this.#client.messages.create({ from: environment.TWILIO_FROM_WAPP, to, body });
        return { sid: m.sid, status: m.status };
    }
}

export const messagingService = new MessagingService();

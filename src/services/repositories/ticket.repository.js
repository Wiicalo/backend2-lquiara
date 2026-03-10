import { TicketDAO } from "../../dao/ticket.dao.js";

export class TicketRepository {
    constructor(dao = new TicketDAO()) { this.dao = dao; }
    async create(data) { return await this.dao.create(data); }
    async getById(id) { return await this.dao.getById(id); }
}

export const ticketRepository = new TicketRepository();

import { BaseDAO } from "./base.dao.js";
import { Ticket } from "../config/models/ticket.model.js";

export class TicketDAO extends BaseDAO {
    constructor() { super(Ticket); }
}

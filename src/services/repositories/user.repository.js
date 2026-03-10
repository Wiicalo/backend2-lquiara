import { UserDAO } from "../../dao/user.dao.js";

export class UserRepository {
    constructor(dao = new UserDAO()) { this.dao = dao; }
    async list() { return await this.dao.getAll(); }
    async getById(id) { return await this.dao.getById(id); }
    async getByEmail(email) { return await this.dao.getOne({ email }); }
    async create(data) { return await this.dao.create(data); }
    async update(id, data) { return await this.dao.updateById(id, data); }
    async remove(id) { return await this.dao.deleteById(id); }
}

export const userRepository = new UserRepository();

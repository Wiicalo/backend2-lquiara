import { Router } from "express";
import { createHash } from "../utils/bcrypt.js";
import { userRepository } from "../../services/repositories/user.repository.js";

const usersRouter = Router();

const toSafeUser = (user) => ({
    _id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    cart: user.cart,
    role: user.role
});

usersRouter.get("/", async (req, res) => {
    try {
        const users = await userRepository.list();
        res.send({ status: "success", users: users.map(toSafeUser) });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al obtener usuarios" });
    }
});

usersRouter.get("/:uid", async (req, res) => {
    try {
        const user = await userRepository.getById(req.params.uid);
        if (!user) {
            return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
        }
        res.send({ status: "success", user: toSafeUser(user) });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al obtener usuario" });
    }
});

usersRouter.post("/", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, cart, role } = req.body;
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send({ status: "error", error: "Faltan campos obligatorios" });
        }
        const newUser = await userRepository.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart,
            role
        });
        res.status(201).send({ status: "success", user: toSafeUser(newUser) });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al crear usuario" });
    }
});

usersRouter.put("/:uid", async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            updates.password = createHash(updates.password);
        }
        const updated = await userRepository.update(req.params.uid, updates);
        if (!updated) {
            return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
        }
        res.send({ status: "success", user: toSafeUser(updated) });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al actualizar usuario" });
    }
});

usersRouter.delete("/:uid", async (req, res) => {
    try {
        const deleted = await userRepository.remove(req.params.uid);
        if (!deleted) {
            return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
        }
        res.send({ status: "success", message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al eliminar usuario" });
    }
});

export default usersRouter;

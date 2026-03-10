import { Router } from "express";
import authRouter from "./routes/auth.router.js";
import homeRouter from "./routes/home.router.js";
import studentRouter from "./routes/student.router.js";
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const router = Router();

router.use("/api/sessions", authRouter);
router.use("/api/users", usersRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);
router.use("/", homeRouter);
router.use("/students", studentRouter);

export default router;

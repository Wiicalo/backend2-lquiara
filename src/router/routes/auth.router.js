import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { environment } from '../config/env.config.js';
import { requireJwtCookie } from '../middleware/auth.middleware.js'; 
import { toCurrentUserDTO } from '../../models/dto/user.dto.js';
import { authService } from '../services/auth.service.js';
import { mailerService } from '../services/mailer.service.js';
import { cartService } from '../services/cart.service.js';

const authRouter = Router();


authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), async (req, res) => {
    if (req.user && !req.user.cart) {
        const cart = await cartService.create();
        req.user.cart = cart._id;
        await req.user.save();
    }
    res.send({ status: "success", message: "Usuario registrado" });
});

authRouter.get('/failregister', async (req, res) => {
    console.log("Fallo el registro");
    res.send({ error: "Fallo el registro" });
});


authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }), async (req, res) => {
    const user = req.user;
    const safeUser = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        cart: user.cart,
        role: user.role
    };
    const token = jwt.sign({ user: safeUser }, environment.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('access_token', token, { httpOnly: true, maxAge: 60 * 60 * 1000 } ); // 1 hora
    res.send({ status: "success", message: "Login exitoso", user: safeUser, token });
});

authRouter.get('/faillogin', (req, res) => {
    res.send({ error: "Fallo el login" });
});


authRouter.get('/current', requireJwtCookie, (req, res) => {
    res.send({ status: "success", user: toCurrentUserDTO(req.user) });
});


authRouter.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.send({ status: "success", message: "Sesión cerrada" });
});

authRouter.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).send({ status: "error", error: "Email requerido" });

    const result = await authService.createResetToken(String(email).trim().toLowerCase());
    if (result) {
        try {
            const baseUrl = environment.BASE_URL || `http://localhost:${environment.PORT || 8080}`;
            const link = `${baseUrl}/reset-password?token=${result.rawToken}&uid=${result.user._id}`;
            await mailerService.sendResetPasswordEmail({ to: result.user.email, link });
        } catch (error) {
            return res.status(500).send({ status: "error", error: "No se pudo enviar el email" });
        }
    }

    res.send({ status: "success", message: "Si el email existe, se envio el enlace de recuperacion" });
});

authRouter.post('/reset-password', async (req, res) => {
    const { uid, token, password } = req.body;
    if (!uid || !token || !password) {
        return res.status(400).send({ status: "error", error: "Faltan campos obligatorios" });
    }

    const result = await authService.resetPassword({ userId: uid, token, newPassword: password });
    if (!result.ok) {
        return res.status(400).send({ status: "error", error: result.reason });
    }
    res.send({ status: "success", message: "Contraseña actualizada" });
});

export default authRouter;

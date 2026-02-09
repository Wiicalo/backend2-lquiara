import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { environment } from '../config/env.config.js';
import { requireJwtCookie } from '../middleware/auth.middleware.js'; 

const authRouter = Router();


authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' }), async (req, res) => {
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
    res.send({ status: "success", user: req.user });
});


authRouter.get('/logout', (req, res) => {
    res.clearCookie('access_token');
    res.send({ status: "success", message: "Sesión cerrada" });
});

export default authRouter;

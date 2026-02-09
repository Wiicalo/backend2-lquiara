import passport from 'passport';

export const requireJwtCookie = (req, res, next) => {
    passport.authenticate('current', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'No autorizado: Token inválido o inexistente' });
        }
        req.user = user;
        next();
    })(req, res, next);
};


export const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'No autorizado: Usuario no autenticado' });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Acceso denegado: No tienes los permisos necesarios' });
    }
    next();
};

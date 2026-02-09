import { Router } from 'express';
import { authorizeRoles } from '../middleware/auth.middleware.js';

const studentRouter = Router();


studentRouter.get('/', authorizeRoles('admin', 'seller'), (req, res) => {
    res.send('Lista de estudiantes (solo para administradores y vendedores)');
});

export default studentRouter;
import { Router } from 'express';

const homeRouter = Router();

homeRouter.get('/', (req, res) => {
    res.send('Bienvenido a la página de inicio!');
});

export default homeRouter;
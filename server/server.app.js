import express from 'express';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { environment } from '../config/env.config.js';
import initializePassport from '../config/auth/passport.config.js';
import authRouter from '../routes/auth.router.js'; 
import homeRouter from '../routes/home.router.js'; 
import studentRouter from '../routes/student.router.js'; 
import usersRouter from '../routes/users.router.js';

const app = express();
const PORT = environment.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(session({
    store: MongoStore.create({
        mongoUrl: environment.MONGO_URL,
        ttl: 60 * 60 * 24 
    }),
    secret: environment.SECRET_SESSION,
    resave: false,
    saveUninitialized: false
}));


initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/sessions', authRouter); 
app.use('/api/users', usersRouter);
app.use('/', homeRouter); 
app.use('/students', studentRouter); 


app.use((req, res) => {
    res.status(404).send({ status: "error", message: "Ruta no encontrada" });
});

const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Servidor escuchando en http://localhost:${PORT}` );
    });
};

export { startServer };

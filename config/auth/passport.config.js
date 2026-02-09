import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import { User } from "../models/user.model.js";
import { createHash, isValidPassword } from "../../utils/bcrypt.js";
import { environment } from "../env.config.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

   
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, age, cart, role } = req.body;
            try {
                let user = await User.findOne({ email: username });
                if (user) {
                    console.log("El usuario ya existe");
                    return done(null, false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: createHash(password),
                    cart,
                    role
                };
                let result = await User.create(newUser);
                return done(null, result);
            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));

    
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await User.findOne({ email: username });
                if (!user) {
                    console.log("El usuario no existe");
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done("Error al iniciar sesión: " + error);
            }
        }
    ));

    
    const jwtOptions = {
        jwtFromRequest: ExtractJWT.fromExtractors([
            ExtractJWT.fromAuthHeaderAsBearerToken(),
            (req) => {
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies['access_token'];
                }
                return token;
            }
        ]),
        secretOrKey: environment.JWT_SECRET
    };

    const jwtVerify = async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.user?._id || jwt_payload.userId || jwt_payload.id);
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    };

    passport.use('jwt', new JWTStrategy(jwtOptions, jwtVerify));
    passport.use('current', new JWTStrategy(jwtOptions, jwtVerify));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await User.findById(id);
        done(null, user);
    });
};

export default initializePassport;

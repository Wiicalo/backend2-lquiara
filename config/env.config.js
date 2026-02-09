import dotenv from 'dotenv';

dotenv.config();

export const environment = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SECRET_SESSION: process.env.SECRET_SESSION
};

export const validateEnv = () => {
    if (!environment.PORT) {
        console.error('Error: La variable de entorno PORT no está definida.');
        process.exit(1);
    }
    if (!environment.MONGO_URL) {
        console.error('Error: La variable de entorno MONGO_URL no está definida.');
        process.exit(1);
    }
    if (!environment.JWT_SECRET) {
        console.error('Error: La variable de entorno JWT_SECRET no está definida.');
        process.exit(1);
    }
    if (!environment.SECRET_SESSION) {
        console.error('Error: La variable de entorno SECRET_SESSION no está definida.');
        process.exit(1);
    }
    console.log('Todas las variables de entorno requeridas están definidas.');
};
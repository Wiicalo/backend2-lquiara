import dotenv from 'dotenv';

dotenv.config();

export const environment = {
    PORT: process.env.PORT,
    MONGO_URL: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SECRET_SESSION: process.env.SECRET_SESSION,
    BASE_URL: process.env.BASE_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_FROM_SMS: process.env.TWILIO_FROM_SMS,
    TWILIO_FROM_WAPP: process.env.TWILIO_FROM_WAPP
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

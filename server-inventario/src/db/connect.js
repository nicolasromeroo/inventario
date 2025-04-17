
import mongoose from 'mongoose';
import dotenv from "dotenv"

dotenv.config()

export const connectMongoDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URL

        if (!mongoURL) throw new Error("La URI de MongoDB no está definida en las variables de entorno.")

        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión exitosa a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    }
};


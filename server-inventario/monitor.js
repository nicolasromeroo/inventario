import mongoose from "mongoose";
import nodemailer from "nodemailer";
import cron from "node-cron";
import twilio from "twilio";
import envsConfig from "./src/config/envs.config.js";

// Conexión a MongoDB
mongoose.connect(envsConfig.MONGO_URL || "mongodb://localhost:27017/inventario/products", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Conectado a MongoDB");
}).catch(err => {
    console.error("❌ Error al conectar a MongoDB:", err);
});

// Esquema del producto
const productSchema = new mongoose.Schema({
    name: String,
    category: String,
    stock: Number,
    stockLimit: Number,
    lastDeliveryDate: Number,
    expirationDates: [Date],
    position: String,
});

const Product = mongoose.model("Product", productSchema);

// Configuración Twilio
const client = twilio(envsConfig.TWILIO_SID, envsConfig.TWILIO_AUTH_TOKEN);
const phoneNumber = envsConfig.TWILIO_PHONE;

// Configuración Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: envsConfig.EMAIL_USER,
        pass: envsConfig.EMAIL_PASS
    }
});

// Verificación de productos
const checkProducts = async () => {
    console.log("Ejecutando checkProducts()...");

    const now = new Date();
    const warningDate = new Date();
    warningDate.setDate(now.getDate() + 15);

    try {
        const productos = await Product.find();

        if (productos.length === 0) {
            console.log("No se encontraron productos en MongoDB.");
            return;
        }

        let expirations = [];
        let overstock = [];

        productos.forEach((product) => {
            const formatearFecha = (fecha) => {
                const date = new Date(fecha);
                return date.toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
            };

            if (product.expirationDates && product.expirationDates.length > 0) {
                product.expirationDates.forEach((fecha) => {
                    const expiration = new Date(fecha);
                    if (!isNaN(expiration) && expiration <= warningDate) {
                        expirations.push(`📦 ${product.name} — vence el ${formatearFecha(expiration)}`);
                    }
                });
            }

            if (
                typeof product.stock === "number" &&
                typeof product.stockLimit === "number" &&
                product.stock > product.stockLimit
            ) {
                overstock.push(`🔴 ${product.name} — stock actual: ${product.stock} (límite: ${product.stockLimit})`);
            }
        });

        let finalAlerts = [];

        if (expirations.length > 0) {
            finalAlerts.push("🕓 *Productos por vencer:*\n" + expirations.join("\n"));
        }

        if (overstock.length > 0) {
            finalAlerts.push("📦 *Exceso de stock:*\n" + overstock.join("\n"));
        }

        if (finalAlerts.length > 0) {
            await sendEmail(finalAlerts);
            await sendSMS(finalAlerts);
        } else {
            console.log("No hay alertas en este momento.");
        }

    } catch (error) {
        console.error("❌ Error al verificar productos:", error);
    }
};

// Envío de email
const sendEmail = async (alerts) => {
    const mailOptions = {
        from: envsConfig.EMAIL_USER,
        to: "nicolasdev290300@gmail.com",
        subject: "⚠️ Alerta de Productos: Vencimientos y Stock",
        text: `\n\n${alerts.join("\n\n")}\n\n\nMensaje enviajo mediante el sistema de monitoreo de stock.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email enviado.");
};

// Envío de SMS
const sendSMS = async (alerts) => {
    const message = `⚠️ ALERTA DE PRODUCTOS\n\n${alerts.join("\n\n")}\n\nVerificar vencimientos y stock.`;

    await client.messages.create({
        body: message,
        from: phoneNumber,
        to: envsConfig.MY_PHONE || "+543515559573",
    });

    console.log("SMS enviado.");
};

// Para pruebas manuales
checkProducts();

// Para producción: Ejecutar todos los días a las 8 AM
// cron.schedule("0 8 * * *", checkProducts);

console.log("🟢 Monitoreo de productos iniciado.");


import mongoose from "mongoose";
// import { productDao } from "./src/dao/product.dao.js";
import Product from "./src/models/Product.js";
import { faker } from "@faker-js/faker";
import envsConfig from "./src/config/envs.config.js"

// Conectar a MongoDB
mongoose.connect(envsConfig.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error al conectar a MongoDB:", err));

// Categorías de productos disponibles
const categories = ["lácteos", "gaseosas", "harinas", "dulces", "carnes", "frutas", "verduras"];

// Función para generar una fecha aleatoria
const getRandomDate = () => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + faker.number.int({ min: 30, max: 365 })); // Entre 1 mes y 1 año
    return futureDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
};

// Función para generar productos aleatorios
const generateRandomProducts = (num) => {
    const products = [];

    for (let i = 0; i < num; i++) {
        products.push({
            name: faker.commerce.productName(),
            category: faker.helpers.arrayElement(categories),
            stock: faker.number.int({ min: 5, max: 500 }),
            expirationDates: [getRandomDate()]
        });
    }
    return products;
};

// Insertar los productos en la base de datos
const seedDatabase = async () => {
    try {
        const products = generateRandomProducts(50);
        await Product.insertMany(products);
        console.log("✅ Se insertaron 50 productos aleatorios en la base de datos.");
        mongoose.disconnect();
    } catch (err) {
        console.error("❌ Error al insertar productos:", err);
        mongoose.disconnect();
    }
};

// Ejecutar la inserción
seedDatabase();

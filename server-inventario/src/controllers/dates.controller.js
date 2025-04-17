
import { productDao } from "../dao/product.dao.js";

// obtener fechas de vencimiento ordenadas por fecha mas próxima
export const getExpiringProducts = async (req, res) => {
    try {
        const products = await productDao.getAll({ expirationDates: { $exists: true, $not: { $size: 0 } } });

        console.log("Tipo de products:", Array.isArray(products));

        console.log("Productos obtenidos:", products);

        const productosOrdenados = products.map(product => ({
            ...product,
            expirationDates: Array.isArray(product.expirationDates)
                ? product.expirationDates.map(date => new Date(date))
                : []

        })).sort((a, b) => new Date(a.expirationDates[0]) - new Date(b.expirationDates[0]));


        console.log(productosOrdenados)

        res.json(productosOrdenados);
    } catch (err) {
        console.error("Error al obtener fechas de vencimiento:", err);
        res.status(500).json({ message: "Error al obtener fechas de vencimiento." });
    }
};

// agregar una fecha de vencimiento a un producto
export const addExpirationDate = async (req, res) => {
    const { productId, expirationDate } = req.body;

    if (!productId || !expirationDate) {
        return res.status(400).json({ message: "ID del producto y fecha de vencimiento son requeridos." });
    }

    try {
        const product = await productDao.getById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }

        product.expirationDates = Array.isArray(product.expirationDates)
            ? [...product.expirationDates, new Date(expirationDate)]
            : [new Date(expirationDate)];

        await product.save();

        res.status(201).json({ message: "Fecha de vencimiento agregada con éxito.", product });
    } catch (err) {
        console.error("Error al agregar fecha de vencimiento:", err);
        res.status(500).json({ message: "Error al agregar fecha de vencimiento." });
    }
};

// eliminar una fecha de vencimiento de un producto
export const removeExpirationDate = async (req, res) => {
    const { productId, expirationDate } = req.body;

    if (!productId || !expirationDate) {
        return res.status(400).json({ message: "ID del producto y fecha de vencimiento son requeridos." });
    }

    try {
        const product = await productDao.getById(productId);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }

        product.expirationDates = product.expirationDates.filter(
            (date) => date.toISOString() !== new Date(expirationDate).toISOString()
        );

        await product.save();

        res.json({ message: "Fecha de vencimiento eliminada.", product });
    } catch (err) {
        console.error("Error al eliminar fecha de vencimiento:", err);
        res.status(500).json({ message: "Error al eliminar fecha de vencimiento." });
    }
};

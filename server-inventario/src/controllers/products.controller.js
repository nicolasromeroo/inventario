
import { productDao } from "../dao/product.dao.js";

export const getProducts = async (req, res) => {
    try {
        const products = await productDao.getAll();
        res.json(products);
    } catch (err) {
        console.error("Error al obtener productos:", err);
        res.status(500).json({ message: "Error al obtener productos." });
    }
};

export const addProduct = async (req, res) => {
    const { name, category, stock, expirationDates, cantidadBultos, unidadesPorBulto, position } = req.body;

    if (!name || !category || !stock || !cantidadBultos || !position || !unidadesPorBulto === undefined) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    try {
        const newProduct = await productDao.create({
            name,
            category,
            stock,
            expirationDates: expirationDates || [],
            cantidadBultos,
            unidadesPorBulto,
            position
        });

        res.status(201).json({ message: "Producto agregado con éxito.", newProduct });
    } catch (err) {
        console.error("Error al cargar el producto:", err);
        res.status(500).json({ message: "Error al cargar el producto." });
    }
};

// export const getProductById = async (req, res) => {
//     try {
//         const product = await productDao.getById(req.params.id)

//         if (!product) return res.status(404).json({ message: "Producto no encontrado." })

//         res.json(product)
//     } catch (err) {
//         res.status(500).json({ message: "Error al obtener producto." })
//     }
// }

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params

        const deleteProduct = await productDao.deleteOne(id)

        if (!deleteProduct) return res.status(404).json({ message: "Producto no encontrado." })

        res.json({ message: "Producto eliminado." })
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
}

export const updateProduct = async (req, res) => {
    const { id } = req.params
    const { cantidadBultos, stock, position } = req.body

    try {
        const updatedProduct = await productDao.update(id, { cantidadBultos, stock, position });

        if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado." })

        res.json(updatedProduct)
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ message: "Error al actualizar el producto" });
    }

}

export const updateProductPosition = async (req, res) => {
    const { id } = req.params
    const { position } = req.body

    if (!position) {
        return res.status(400).json({ message: "La posición es obligatoria." })
    }

    try {
        const updatedProduct = await productDao.update(id, { position })

        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado." })
        }

        res.json({ message: "Posicion actualizada con éxito.", product: updatedProduct })
    } catch (err) {
        console.error("Error al actualizar posición del producto:", err);
        res.status(500).json({ message: "Error al actualizar posición del producto." });
    }
}
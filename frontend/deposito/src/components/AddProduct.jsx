import { useState } from "react";

const AddProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        category: "",
        cantidadBultos: "",
        unidadesPorBulto: "",
        expirationDate: "",
        position: ""
    });

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!product.name || !product.category || !product.cantidadBultos || !product.unidadesPorBulto || !product.position) {
            setError("Por favor, completa todos los campos obligatorios.");
            return;
        }

        const formattedProduct = {
            ...product,
            cantidadBultos: Number(product.cantidadBultos),
            unidadesPorBulto: Number(product.unidadesPorBulto),
            stock: Number(product.cantidadBultos) * Number(product.unidadesPorBulto),
            expirationDates: product.expirationDate
                ? [{
                    date: new Date(product.expirationDate),
                    stock: Number(product.cantidadBultos) * Number(product.unidadesPorBulto)
                }]
                : [],
            position: product.position.toUpperCase()
        };

        try {
            const res = await fetch("https://inventario-ijcm.onrender.com/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedProduct)
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "Producto agregado correctamente.");
                setError(null);
                setProduct({ name: "", category: "", cantidadBultos: "", unidadesPorBulto: "", expirationDate: "", position: "" });
            } else {
                setError(data.message || "Hubo un error al agregar el producto.");
            }
        } catch (err) {
            console.error("Error al agregar producto:", err);
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-5">
                            <h3 className="mb-5 text-center fw-bold text-dark">Ingresar nuevo artículo</h3>

                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label fw-semibold">Nombre del producto</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        placeholder="Ej: Yerba Mate Taragüi 500g"
                                        value={product.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label fw-semibold">Categoría</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="category"
                                        name="category"
                                        placeholder="Ej: Bebidas, Lacteos, Limpieza"
                                        value={product.category}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Stock</label>
                                    <div className="row g-2">
                                        <div className="col">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="cantidadBultos"
                                                placeholder="Cantidad de bultos"
                                                value={product.cantidadBultos}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col">
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="unidadesPorBulto"
                                                placeholder="Unidades por bulto"
                                                value={product.unidadesPorBulto}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="expirationDate" className="form-label fw-semibold">Fecha de vencimiento</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="expirationDate"
                                        name="expirationDate"
                                        value={product.expirationDate}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="position" className="form-label fw-semibold">Posición en depósito</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="position"
                                        name="position"
                                        placeholder="Ej: Estante 1A"
                                        value={product.position.toUpperCase()}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-warning w-100 py-2 fs-5 fw-bold">
                                    Agregar artículo
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;


import { useEffect, useState } from "react";
import { FaCalendarAlt, FaBoxes, FaTag } from "react-icons/fa";
import "../assets/styles/expirations.css"

const Expirations = () => {
    const [products, setProducts] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const getUrgencyClass = (date) => {
        const today = new Date();
        const expiration = new Date(date);
        const diffTime = expiration - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 10) return "text-danger fw-bold";
        if (diffDays <= 15) return "text-warning fw-semibold";
        return "text-body-secondary";
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/products/deleteProduct/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setProducts(prev => prev.filter(p => (p._doc || p)._id !== id));
            } else {
                console.error("Error al eliminar el producto");
            }
        } catch (error) {
            console.error("Error en la solicitud DELETE:", error);
        }
    };

    useEffect(() => {
        fetch("http://localhost:3000/api/dates/getDate")
            .then((res) => res.json())
            .then((data) => setProducts(data))
            .catch((err) => console.error("Error al obtener vencimientos:", err));
    }, []);

    const productosFiltrados = products.filter((product) => {
        const data = product._doc || product;
        return data.name.toLowerCase().includes(busqueda.toLowerCase());
    });


    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center text-dark">PRÓXIMOS VENCIMIENTOS</h2>

            <div className="busqueda-container">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="form-control mb-3"
                />
            </div>

            <div className="row g-4">
                {products.length === 0 ? (
                    <div className="text-center text-muted">
                        No hay productos próximos a vencer.
                    </div>
                ) : (
                    productosFiltrados.map((product, index) => {
                        const data = product._doc || product;

                        return (
                            <div key={data._id || index} className="col-sm-12 col-md-6 col-lg-4">
                                <div className="card border-0 shadow-sm h-100 rounded-4">
                                    <div className="card-body">
                                        <h5 className="card-title text-primary d-flex align-items-center">
                                            <FaTag className="me-2 text-primary" />
                                            {data.name}
                                        </h5>

                                        <p className="card-text text-secondary d-flex align-items-center mb-2">
                                            <FaBoxes className="me-2 text-secondary" />
                                            <span><strong>Stock:</strong> {data.stock} unidades</span>
                                        </p>

                                        <p className="card-text text-secondary d-flex align-items-center mb-2">
                                            📍 <span className="ms-2"><strong>Posición:</strong> {data.position || "No especificada"}</span>
                                        </p>

                                        <p className="card-text d-flex align-items-center mb-1 text-dark fw-semibold">
                                            <FaCalendarAlt className="me-2" />
                                            Vencimientos:
                                        </p>

                                        {data.expirationDates && data.expirationDates.length > 0 ? (
                                            <ul className="list-group list-group-flush">
                                                {data.expirationDates.map((entry, idx) => (
                                                    <li
                                                        key={idx}
                                                        className={`list-group-item ps-4 border-0 ${getUrgencyClass(entry.date)}`}
                                                    >
                                                        {formatDate(entry.date)}
                                                    </li>
                                                ))}

                                            </ul>
                                        ) : (
                                            <p className="text-warning ps-4">Sin fecha de vencimiento</p>
                                        )}

                                        <button
                                            className="btn btn-sm btn-outline-danger mt-3"
                                            onClick={() => handleDelete(data._id)}
                                        >
                                            Eliminar producto
                                        </button>

                                    </div>
                                </div>
                            </div>

                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Expirations;

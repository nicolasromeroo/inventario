import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaLongArrowAltDown, FaLongArrowAltUp, FaBox, FaMapMarkerAlt, FaCalendarAlt, FaAppleAlt, FaToiletPaper, FaUtensils, FaBeer } from "react-icons/fa";
import "../assets/styles/productList.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAppleWhole, faPepperHot, faDrumstickBite, faBreadSlice, faCandyCane, faBlender } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const groupByNameAndWeight = (products) => {
    const grouped = {};

    products.forEach((item) => {
        const data = item._doc || item;
        const key = `${data.name}-${data.weight || ""}`;

        if (!grouped[key]) {
            grouped[key] = {
                ...data,
                expirationDates: (data.expirationDates || []).map((exp) => ({
                    ...exp,
                    stock: data.stock || 0,
                    date: exp.date ? exp.date : '',
                })),
            };
        } else {
            grouped[key].expirationDates.push(
                ...((data.expirationDates || []).map((exp) => ({
                    ...exp,
                    stock: data.stock || 0,
                    date: exp.date ? exp.date : '',
                })))
            );
        }
    });

    return Object.values(grouped);
};



const ProductList = () => {
    const [busqueda, setBusqueda] = useState("");
    const [products, setProducts] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [expandedProducts, setExpandedProducts] = useState({});
    // const [newPosition, setNewPosition] = useState("");
    const [newPositions, setNewPositions] = useState({});
    const [newExpirations, setNewExpirations] = useState({});

    const fetchProductos = async () => {
        try {
            const res = await axios.get("https://inventario-ijcm.onrender.com/api/products/getProducts")
            setProducts(res.data)
        } catch (err) {
            console.error("Error al obtener propductos:", err)
        }
    }

    useEffect(() => {
        fetchProductos()
    }, []);

    const categoryIcons = {
        gaseosas: <FaBeer className="me-2 text-white" />,
        frutas: <FontAwesomeIcon icon={faAppleWhole} className="me-2 text-white" />,
        verduras: <FontAwesomeIcon icon={faPepperHot} className="me-2 text-white" />,
        limpieza: <FaToiletPaper className="me-2 text-white" />,
        carnes: <FontAwesomeIcon icon={faDrumstickBite} className="me-2 text-white" />,
        lacteos: <FontAwesomeIcon icon={faBlender} className="me-2 text-white" />,
        harinas: <FontAwesomeIcon icon={faBreadSlice} className="me-2 text-white" />,
        dulces: <FontAwesomeIcon icon={faCandyCane} className="me-2 text-white" />
    }

    const productosFiltrados = products.filter((product) => {
        const texto = busqueda.toLowerCase();
        return (
            product.name.toLowerCase().includes(texto) ||
            product.description?.toLowerCase().includes(texto) ||
            product.category?.toLowerCase().includes(texto)
        );
    });

    const groupedFilteredProducts = productosFiltrados.reduce((acc, product) => {
        const cat = product.category;
        acc[cat] = acc[cat] || [];
        acc[cat].push(product);
        return acc;
    }, {});

    Object.keys(groupedFilteredProducts).forEach(category => {
        groupedFilteredProducts[category] = groupByNameAndWeight(groupedFilteredProducts[category]);
    });

    const toggleCategory = (category) => {
        setExpandedCategory(prev => (prev === category ? null : category));
    };

    const toggleProductDetails = (productId) => {
        setExpandedProducts(prev => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    const formatDate = (dateInput) => {
        const fecha = typeof dateInput === 'string' ? dateInput : dateInput?.date;

        console.log("Fecha procesada en formatDate:", fecha);

        if (!fecha) return "Sin fecha";

        const parsed = new Date(fecha);
        if (isNaN(parsed)) return "Fecha inválida";

        return parsed.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const actualizarBultos = async (id, cantidadBultos, unidadesPorBulto, operacion) => {
        const nuevoValor = operacion === "sumar" ? Number(cantidadBultos) + 1 : Number(cantidadBultos) - 1;
        if (nuevoValor < 0) return alert("No se pueden tener bultos negativos.");

        const nuevoStock = nuevoValor * unidadesPorBulto;

        try {
            const productoActual = products.find(p => p._id === id);
            const stockAnterior = productoActual?.stock || 0;

            const updatePayload = {
                cantidadBultos: nuevoValor,
                stock: nuevoStock,
            };

            if (stockAnterior === 0 && operacion === "sumar") {
                const nuevaFecha = newExpirations[id];
                if (nuevaFecha) {
                    updatePayload.expirationDates = [nuevaFecha];
                    setNewExpirations((prev) => ({ ...prev, [id]: "" }));
                } else {
                    alert("Por favor, ingresa una fecha de vencimiento antes de agregar stock.");
                    return;
                }
            }

            await axios.put(`https://inventario-ijcm.onrender.com/api/products/updateProduct/${id}`, updatePayload);
            fetchProductos();
        } catch (err) {
            console.error("Error al actualizar bultos:", err);
        }
    };

    const updateProductPosition = async (productId, position) => {
        try {
            const res = await axios.put(`https://inventario-ijcm.onrender.com/api/products/updateProduct/${productId}`, {
                position: position,
            });
            fetchProductos();
            console.log(res);
        } catch (err) {
            console.error("Error al actualizar posición:", err);
        }
    };

    const getUrgencyClass = (date) => {
        const today = new Date();
        const expiration = new Date(date);
        const diffTime = expiration - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 10) return "text-danger fw-bold";
        if (diffDays <= 15) return "text-warning fw-semibold";
        return "text-muted";
    };



    return (

        <div className="container mt-5">
            <h2 className="mb-4 text-center text-dark">PRODUCTOS</h2>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar producto por nombre, descripción o categoría..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>


            <div className="row">
                {Object.keys(groupedFilteredProducts).map(category => (
                    <div key={category} className="col-md-6 col-lg-4 mb-4">
                        <div className="card shadow-sm">
                            <div
                                className="card-header bg-warning fs-5 text-white d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() => toggleCategory(category)}
                                role="button"
                            >
                                <span>{expandedCategory === category ? <FaLongArrowAltUp /> : <FaLongArrowAltDown />}</span>
                                <span className="fw-bold">
                                    {categoryIcons[category.toLowerCase()] || null}
                                    {category.toUpperCase()}
                                </span>
                            </div>

                            <div className={`toggle-content ${expandedCategory === category ? "open" : ""} p-1`}>
                                <ul className="list-group list-group-flush">
                                    {groupedFilteredProducts[category].map(product => (
                                        <li
                                            key={product._id}
                                            className="list-group-item"
                                            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
                                            onClick={() => toggleProductDetails(product._id)}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span><FaBox className="me-2" />{product.name}</span>
                                                <span className="badge bg-dark">
                                                    {product.cantidadBultos} (b) -
                                                    <span className="ms-2 text-white">{product.stock} (u)</span>
                                                </span>
                                                <div className="botones-bultos">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            actualizarBultos(product._id, product.cantidadBultos, product.unidadesPorBulto, "restar")
                                                        }}
                                                    >
                                                        ➖
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            actualizarBultos(product._id, product.cantidadBultos, product.unidadesPorBulto, "sumar")
                                                        }}
                                                    >
                                                        ➕
                                                    </button>
                                                </div>

                                                {product.stock === 0 && expandedProducts[product._id] && (
                                                    <div className="mt-2">
                                                        <label htmlFor={`expiration-${product._id}`} className="form-label">Nueva fecha de vencimiento:</label>
                                                        <input
                                                            type="date"
                                                            id={`expiration-${product._id}`}
                                                            className="form-control"
                                                            value={newExpirations[product._id] || ""}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={(e) =>
                                                                setNewExpirations((prev) => ({
                                                                    ...prev,
                                                                    [product._id]: e.target.value
                                                                }))
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {
                                                expandedProducts[product._id] && (
                                                    <div className="product-details">
                                                        <p className="mb-1">
                                                            <FaMapMarkerAlt className="me-2 text-secondary" />
                                                            <strong>Ubicación:</strong> {product.position || "No especificada"}
                                                        </p>
                                                        <p className="mb-1">
                                                            <FaCalendarAlt className="me-2 text-secondary" />
                                                            <strong>Última entrega:</strong> {product.lastDeliveryDate ? formatDate(product.lastDeliveryDate) : "No disponible"}
                                                        </p>
                                                        <div className="d-flex align-items-center">
                                                            <input
                                                                type="text"
                                                                className="form-control me-2"
                                                                placeholder="Nueva ubicación"
                                                                value={(newPositions[product._id] || "").toUpperCase()}
                                                                onClick={(e) => e.stopPropagation()}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    setNewPositions((prev) => ({
                                                                        ...prev,
                                                                        [product._id]: e.target.value.toLocaleUpperCase()
                                                                    }));
                                                                }}
                                                            />



                                                            <button
                                                                className="btn btn-primary"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateProductPosition(product._id, newPositions[product._id]);
                                                                    setNewPositions((prev) => ({
                                                                        ...prev,
                                                                        [product._id]: ""
                                                                    }));
                                                                }}
                                                            >
                                                                Actualizar posición
                                                            </button>



                                                        </div>
                                                        <div>
                                                            <FaCalendarAlt className="me-2 text-secondary" />
                                                            <strong>Vencimientos:</strong>
                                                            <ul className="mt-1 ps-3">

                                                                {product.expirationDates.map((exp, i) => (
                                                                    <div key={i}>
                                                                        {formatDate(exp.date)} - {exp.stock}
                                                                    </div>
                                                                ))}



                                                            </ul>

                                                        </div>

                                                    </div>

                                                )
                                            }
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default ProductList;

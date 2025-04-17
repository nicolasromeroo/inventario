import React, { useEffect, useState } from "react";
import "../assets/styles/racks.css";
import axios from "axios";
import { motion } from "framer-motion";

const columnas = ["A", "B", "C", "D", "E"];
const filas = [3, 2, 1, 0];

const Racks = () => {
    const [productos, setProductos] = useState([]);
    const [mostrarCroquis, setMostrarCroquis] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const fetchProductos = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/products/getProducts");
            setProductos(res.data);
            console.log("Productos recibidos:", res.data);
        } catch (err) {
            console.error("Error al obtener productos:", err);
        }
    };

    useEffect(() => {

        fetchProductos();

    }, []);

    const ubicaciones = {};
    productos.forEach((prod) => {
        if (prod.position) {
            if (!ubicaciones[prod.position]) {
                ubicaciones[prod.position] = [];
            }
            ubicaciones[prod.position].push(prod);
        }
    });

    const [celdaActiva, setCeldaActiva] = useState(null);

    const toggleCelda = (pos) => {
        setCeldaActiva(celdaActiva === pos ? null : pos);
    };

    const celdaTieneCoincidencia = (productosCelda) => {
        if (!busqueda.trim()) return false;
        const busquedaLower = busqueda.toLowerCase();
        return productosCelda && productosCelda.some(prod =>
            prod.name && prod.name.toLowerCase().includes(busquedaLower)
            // acá se pueden agregar más condiciones, por ejemplo descripción, etc.
        );
    };

    const filtrarCelda = (productosCelda) => {
        if (!busqueda.trim()) return true;
        return celdaTieneCoincidencia(productosCelda);
    };

    const actualizarBultos = async (id, cantidadBultos, unidadesPorBulto, operacion) => {
        const nuevoValor = operacion === "sumar" ? Number(cantidadBultos) + 1 : Number(cantidadBultos) - 1;
        if (nuevoValor < 0) return alert("No se pueden tener bultos negativos.");

        const nuevoStock = nuevoValor * unidadesPorBulto;

        try {
            await axios.put(`http://localhost:3000/api/products/updateProduct/${id}`, {
                cantidadBultos: nuevoValor,
                stock: nuevoStock,
            });
            fetchProductos();
        } catch (err) {
            console.error("Error al actualizar bultos:", err);
        }
    };


    const eliminarProductoDePosicion = async (id) => {
        try {
            await axios.put(`http://localhost:3000/api/products/updateProduct/${id}`, {
                position: "",
            });
            fetchProductos();
        } catch (err) {
            console.error("Error al eliminar producto de posición:", err);
        }
    };

    const moverProductoDePosicion = async (id, nuevaPosicion) => {
        try {
            await axios.put(`http://localhost:3000/api/products/updateProduct/${id}`, {
                position: nuevaPosicion,
            });
            fetchProductos();
        } catch (err) {
            console.error("Error al mover el producto:", err);
        }
    };

    // lógica de vencimientos
    const esProximoAVencer = (producto) => {
        const hoy = new Date();
        const fechas = producto.expirationDates || [];
        return fechas.some(f => {
            const fecha = new Date(f.date);
            const diferenciaDias = (fecha - hoy) / (1000 * 60 * 60 * 24);
            return diferenciaDias <= 30 && diferenciaDias >= 0;
        });
    };


    const obtenerProximaFechaVencimiento = (fechas) => {
        if (!Array.isArray(fechas) || fechas.length === 0) return null;
        const fechasOrdenadas = fechas
            .map(f => new Date(f.date))
            .filter(f => !isNaN(f))
            .sort((a, b) => a - b);
        return fechasOrdenadas[0];
    };

    return (
        <div className="croquis-container mt-4">
            {/* <div className="menu-toggle" onClick={() => setMostrarCroquis(!mostrarCroquis)}>
                ☰ Mostrar/Ocultar
            </div> */}

            <h2 className="mb-4 text-center text-dark">POSICIONES</h2>

            <div className="busqueda-container">
                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="form-control mb-3"
                />
            </div>

            {mostrarCroquis && (
                <motion.div
                    className="croquis-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {filas.map((fila) =>
                        columnas.map((col) => {
                            const pos = `${fila}${col}`;

                            const esProximoVencimientoEnCelda = ubicaciones[pos]?.some(prod => esProximoAVencer(prod));
                            const esCoincidencia = celdaTieneCoincidencia(ubicaciones[pos]);

                            return (
                                <div
                                    key={pos}
                                    className={`celda 
                                        ${ubicaciones[pos] ? "ocupado" : ""} 
                                        ${celdaActiva === pos ? "activa" : ""} 
                                        ${esCoincidencia ? "resultado-busqueda" : ""} 
                                        ${esProximoVencimientoEnCelda ? "proximo-vencer" : ""}
                                        ${ubicaciones[pos]?.some(p => p.expirationDates.some(f => new Date(f.date) < new Date())) ? "vencido" : ""}
                                        `}
                                    onClick={() => toggleCelda(pos)}
                                >
                                    <strong>{pos}</strong>
                                    <div className="nombres-productos">
                                        {ubicaciones[pos] ? (
                                            ubicaciones[pos].map((prod) => (
                                                <div key={prod._id} className="producto-nombre">
                                                    {prod.name}
                                                </div>
                                            ))
                                        ) : (
                                            "LUGAR DISPONIBLE"
                                        )}
                                    </div>
                                    {celdaActiva === pos && ubicaciones[pos] && (

                                        <div className="descripcion-productos">
                                            {ubicaciones[pos].map((prod) => (
                                                <div key={prod._id}>
                                                    <strong>{prod.name}</strong>
                                                    <div className="bultos-control">

                                                        <span>{prod.cantidadBultos} bultos, {prod.stock} unidades</span>
                                                        <div className="fecha-vencimiento">

                                                            {(() => {
                                                                const proximaFecha = obtenerProximaFechaVencimiento(prod.expirationDates);
                                                                return proximaFecha
                                                                    ? `Vencimiento: ${proximaFecha.toLocaleDateString('es-AR', {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric'
                                                                    })}`
                                                                    : "Sin fecha de vencimiento";
                                                            })()}


                                                        </div>

                                                        <div className="input-container">
                                                            <div className="acciones-producto mt-2">
                                                                <button
                                                                    className="btn btn-danger btn-sm me-2"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        eliminarProductoDePosicion(prod._id);
                                                                    }}
                                                                >
                                                                    Eliminar
                                                                </button>

                                                                <input
                                                                    type="text"
                                                                    placeholder="Nueva posición"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            moverProductoDePosicion(prod._id, e.target.value.toUpperCase());
                                                                        }
                                                                    }}
                                                                    className="form-control form-control-sm p-1 mt-1 d-inline w-auto"
                                                                    style={{ width: "100px" }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="botones-bultos m-0">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    actualizarBultos(prod._id, prod.cantidadBultos, prod.unidadesPorBulto, "restar")
                                                                }}
                                                            >
                                                                ➖
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    actualizarBultos(prod._id, prod.cantidadBultos, prod.unidadesPorBulto, "sumar")
                                                                }}
                                                            >
                                                                ➕
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    )}

                                </div>

                            );
                        })
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Racks;

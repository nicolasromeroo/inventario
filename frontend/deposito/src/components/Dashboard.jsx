import { Link } from 'react-router-dom';

const Dashboard = () => {
    const cards = [
        {
            title: "Ubicaciones",
            text: "Muestra de croquis de un rack",
            img: "https://cdn-icons-png.flaticon.com/512/7282/7282807.png",
            alt: "deposito",
            link: "/posiciones"
        },
        {
            title: "Vencimientos",
            text: "Productos próximos a vencer",
            img: "https://png.pngtree.com/png-clipart/20220404/original/pngtree-quality-control-badge-passed-vector-icon-png-image_7511164.png",
            alt: "vencimientos",
            link: "/vencimientos"
        },
        {
            title: "Inventario",
            text: "Productos en stock",
            img: "https://png.pngtree.com/png-vector/20240805/ourmid/pngtree-shopping-and-buying-products-at-grocery-store-png-image_13091650.png",
            alt: "inventario",
            link: "/articulos"
        },
    ];

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                {cards.map((card, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <Link to={card.link} className="text-decoration-none text-dark">
                            <div className="card dash-card shadow-sm h-100">
                                <div className="row g-0 align-items-center">
                                    <div className="col-4 text-center bg-light p-2">
                                        <img
                                            src={card.img}
                                            alt={card.alt}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: "80px", objectFit: "contain" }}
                                        />
                                    </div>
                                    <div className="col-8">
                                        <div className="card-body">
                                            <h5 className="card-title fw-bold">{card.title}</h5>
                                            <p className="card-text text-muted">{card.text}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;

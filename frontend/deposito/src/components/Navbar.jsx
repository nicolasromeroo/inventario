

import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles/navBar.css';

const NavigationBar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm navBar py-3 px-2 nav-animated">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3 fw-bold fs-5 text-white">
                    <img
                        src="https://scontent.fcor2-1.fna.fbcdn.net/v/t39.30808-6/394028255_1067240248016733_1079465709048703495_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=ywH48gs4GY8Q7kNvwGXwT_K&_nc_oc=AdkMORCZIVKT9Ke5i4B_TxPgx4oCSJPJuw_ISFwn2rIdu3DlqO9Lq7XqujbJMN5gXRs&_nc_zt=23&_nc_ht=scontent.fcor2-1.fna&_nc_gid=fxkmbvj0A0TWOgOJE4_-kA&oh=00_AfF_f3Dj5MI87bkWb1fX-XDLSecEHRSsuEZcmj9DkW2jaw&oe=680498DC"
                        alt="Logo"
                        width="40"
                        height="40"
                        className="rounded-circle border border-light shadow-sm"
                    />
                    ||  DEPÓSITO
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="gap-3 mt-3 mt-lg-0">
                        <Nav.Link as={Link} to="/articulos" className="nav-btn">
                            Artículos
                        </Nav.Link>
                        <Nav.Link as={Link} to="/vencimientos" className="nav-btn">
                            Vencimientos
                        </Nav.Link>
                        <Nav.Link as={Link} to="/ingresar-articulo" className="nav-btn">
                            Ingresar Artículo
                        </Nav.Link>
                        <Nav.Link as={Link} to="/posiciones" className="nav-btn">
                            Ubicaciones
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavigationBar;

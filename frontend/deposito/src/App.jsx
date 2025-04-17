// import './assets/styles/styles.css';
import "./assets/styles/dashboard.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from './components/Navbar.jsx';
import ProductList from './components/ProductsList.jsx';
import Expirations from './components/Expirations.jsx';
import AddProduct from './components/AddProduct.jsx';
// import Register from './components/Register.jsx';
// import Profile from './components/Profile.jsx';
// import TaskManager from './components/TaskManager.jsx';
import Racks from './components/Racks.jsx';
import Dashboard from './components/Dashboard.jsx';

const App = () => {
    return (
        <Router>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');
            </style>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/posiciones" element={<Racks />} />
                    <Route path="/articulos" element={<ProductList />} />
                    <Route path="/vencimientos" element={<Expirations />} />
                    <Route path="/ingresar-articulo" element={<AddProduct />} />
                    {/* <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/tasks" element={<TaskManager />} /> */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;

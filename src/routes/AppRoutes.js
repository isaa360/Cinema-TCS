import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavbar from '../components/NavBar/NavBar';
import Filmes from '../pages/Filmes/Filmes';
import Salas from '../pages/Salas/Salas';
import Sessoes from '../pages/Sessoes/Sessoes';
import Ingressos from '../pages/Ingressos/Ingressos';
import Home from '../pages/Home/Home';

const AppRoutes = () => {
    return (
        <Router>
            <AppNavbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/filmes" element={<Filmes />} />
                <Route path="/salas" element={<Salas />} />
                <Route path="/sessoes" element={<Sessoes />} />
                <Route path="/ingressos" element={<Ingressos />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
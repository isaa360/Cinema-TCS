import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/"><i class="bi bi-house-fill"></i></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/filmes">Filmes</Nav.Link>
                        <Nav.Link as={Link} to="/salas">Salas</Nav.Link>
                        <Nav.Link as={Link} to="/sessoes">Sessões</Nav.Link>
                        <Nav.Link as={Link} to="/ingressos">Ingressos</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
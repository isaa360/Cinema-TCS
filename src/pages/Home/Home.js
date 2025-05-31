import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from '../../components/common/Button/Button';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <Container className="mt-4">
            <h2 className="mb-3">Cinema</h2>

            <Row className="justify-content-start"> 
                <Col xs={12} md={4} className="mb-3"> 
                    {/* Cadastro de Filmes */}
                    <Button as={Link} to="/filmes" className="w-100">
                        <i className="bi bi-film me-2"></i>Cadastro de Filmes
                    </Button>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                    {/* Cadastro de Salas */}
                    <Button as={Link} to="/salas" className="w-100">
                        <i className="bi bi-door-open me-2"></i>Cadastro de Salas
                    </Button>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                    {/* Cadastro de Sessões */}
                    <Button as={Link} to="/sessoes" className="w-100">
                        <i className="bi bi-calendar-check me-2"></i>Cadastro de Sessões
                    </Button>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                    {/* Venda de Ingressos */}
                    <Button as={Link} to="/venda-ingressos" className="w-100">
                        <i className="bi bi-ticket-perforated me-2"></i>Venda de Ingressos
                    </Button>
                </Col>
                <Col xs={12} md={4} className="mb-3">
                    {/* Sessões Disponíveis */}
                    <Button as={Link} to="/sessoes" className="w-100">
                        <i class="bi bi-card-list me-2"></i>Sessões Disponíveis
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Home;
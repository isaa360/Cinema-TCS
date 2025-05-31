import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';

const Salas = () => {
    const [salas, setSalas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentSala, setCurrentSala] = useState({
        id: null,
        nome: '',
        capacidade: '',
        tipo: '2D' 
    });

    useEffect(() => {
        const storedSalas = JSON.parse(localStorage.getItem('salas')) || [];
        setSalas(storedSalas);
    }, []);

    // Fechar modal
    const handleClose = () => {
        setShowModal(false);
        setCurrentSala({
            id: null,
            nome: '',
            capacidade: '',
            tipo: '2D'
        });
    };

    // Abrir modal
    const handleShow = (sala = { id: null, nome: '', capacidade: '', tipo: '2D' }) => {
        setCurrentSala(sala);
        setShowModal(true); 
    };

    // Atualizar currentSala
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSala(prevState => ({ ...prevState, [name]: value }));
    };

    // Envio de formulário
    const handleSubmit = () => {
        if (!currentSala.nome || !currentSala.capacidade) {
            alert('Por favor, preencha todos os campos obrigatórios (Nome e Capacidade).');
            return;
        }

        let updatedSalas;
        if (currentSala.id) {
            // Atualizar sala
            updatedSalas = salas.map(s => s.id === currentSala.id ? currentSala : s);
        } else {
            updatedSalas = [...salas, { ...currentSala, id: salas.length > 0 ? Math.max(...salas.map(s => s.id)) + 1 : 1 }];
        }

        setSalas(updatedSalas); 
        localStorage.setItem('salas', JSON.stringify(updatedSalas)); 
        alert('Sala cadastrada com sucesso!'); 
        handleClose(); 
    };

    // Deletar sala
    const handleDelete = (id) => {
        const updatedSalas = salas.filter(s => s.id !== id);
        setSalas(updatedSalas); // Atualiza o estado no React.
        localStorage.setItem('salas', JSON.stringify(updatedSalas)); // Persiste no localStorage
        alert('Sala excluída com sucesso!');
    };

    // Interface
    return (
        <Container className="mt-4">
            <h2 className="mb-3">Gerenciamento de Salas</h2>

            <Row className="mb-3">
                <Col>
                    <Button onClick={() => handleShow()}>
                        <i className="bi bi-plus-circle me-2"></i>Nova Sala
                    </Button>
                </Col>
            </Row>

            <h3>Salas Cadastradas</h3>
            {/* Exibe lista de salas */}
            {salas.length === 0 ? (
                <p>Nenhuma sala cadastrada.</p>
            ) : (
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Capacidade</th>
                            <th>Tipo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salas.map(sala => (
                            <tr key={sala.id}>
                                <td>{sala.id}</td>
                                <td>{sala.nome}</td>
                                <td>{sala.capacidade}</td>
                                <td>{sala.tipo}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(sala)}>
                                        <i className="bi bi-pencil"></i> Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(sala.id)}>
                                        <i className="bi bi-trash"></i> Excluir
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal com formulário */}
            <Modal
                show={showModal}
                handleClose={handleClose}
                title={currentSala.id ? 'Editar Sala' : 'Adicionar Nova Sala'}
                footerButtons={[
                    { label: 'Cancelar', variant: 'secondary', onClick: handleClose },
                    { label: currentSala.id ? 'Salvar Alterações' : 'Salvar Sala', variant: 'primary', onClick: handleSubmit},
                ]}
            >

                <Input
                    label="Nome da Sala"
                    name="nome"
                    value={currentSala.nome}
                    onChange={handleChange}
                    placeholder="Nome da Sala"
                    required
                />
                <Input
                    label="Capacidade"
                    name="capacidade"
                    type="number"
                    value={currentSala.capacidade}
                    onChange={handleChange}
                    placeholder="Capacidade da Sala"
                    required
                />
                <Input
                    label="Tipo"
                    name="tipo"
                    value={currentSala.tipo}
                    onChange={handleChange}
                    as="select"
                >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                </Input>
            </Modal>
        </Container>
    );
};

export default Salas;
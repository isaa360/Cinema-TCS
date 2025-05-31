// src/pages/Filmes/Filmes.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';

const Filmes = () => {
    const [filmes, setFilmes] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [currentFilme, setCurrentFilme] = useState({
        id: null,
        titulo: '',
        descricao: '',
        genero: 'Ação',
        classificacao: 'L',
        duracao: '',
        estreia: ''
    });

    useEffect(() => {
        const storedFilmes = JSON.parse(localStorage.getItem('filmes')) || [];
        setFilmes(storedFilmes);
    }, []); 

    const handleClose = () => {
        setShowModal(false);
        // Deixa formulário vazio
        setCurrentFilme({
            id: null,
            titulo: '',
            descricao: '',
            genero: 'Ação',
            classificacao: 'L',
            duracao: '',
            estreia: ''
        });
    };

    const handleShow = (filme = { id: null, titulo: '', descricao: '', genero: 'Ação', classificacao: 'L', duracao: '', estreia: '' }) => {
        setCurrentFilme(filme); 
        setShowModal(true); // Abre o modal
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentFilme(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = () => {
        if (!currentFilme.titulo || !currentFilme.duracao || !currentFilme.genero || !currentFilme.classificacao || !currentFilme.estreia) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        let updatedFilmes;
        if (currentFilme.id) {
            updatedFilmes = filmes.map(f => f.id === currentFilme.id ? currentFilme : f);
        } else {
            updatedFilmes = [...filmes, { ...currentFilme, id: filmes.length > 0 ? Math.max(...filmes.map(f => f.id)) + 1 : 1 }];
        }

        setFilmes(updatedFilmes); 
        localStorage.setItem('filmes', JSON.stringify(updatedFilmes)); 
        alert('Filme salvo com sucesso!'); 
        handleClose(); // Fecha modal e reseta formulário
    };

    // Deletar filme
    const handleDelete = (id) => {
        const updatedFilmes = filmes.filter(f => f.id !== id);
        setFilmes(updatedFilmes); 
        localStorage.setItem('filmes', JSON.stringify(updatedFilmes));
        alert('Filme excluído com sucesso!');
    };

    // Interface usuário
    return (
        <Container className="mt-4">
            <h2 className="mb-3">Gerenciamento de Filmes</h2>

            <Row className="mb-3">
                <Col>
                    <Button onClick={() => handleShow()}>
                        <i className="bi bi-plus-circle me-2"></i>Novo Filme
                    </Button>
                </Col>
            </Row>

            <h3>Filmes Cadastrados</h3>
            {filmes.length === 0 ? (
                <p>Nenhum filme cadastrado.</p>
            ) : (
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Gênero</th>
                            <th>Duração</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filmes.map(filme => (
                            <tr key={filme.id}>
                                <td>{filme.id}</td>
                                <td>{filme.titulo}</td>
                                <td>{filme.genero}</td>
                                <td>{filme.duracao} min</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(filme)}>
                                        <i className="bi bi-pencil"></i> Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(filme.id)}>
                                        <i className="bi bi-trash"></i> Excluir
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal
                show={showModal}
                handleClose={handleClose}
                title={currentFilme.id ? 'Editar Filme' : 'Adicionar Novo Filme'}
                footerButtons={[
                    { label: 'Cancelar', variant: 'secondary', onClick: handleClose },
                    { label: currentFilme.id ? 'Salvar Alterações' : 'Salvar Filme', variant: 'primary', onClick: handleSubmit },
                ]}
            >
                <Input
                    label="Título"
                    name="titulo"
                    value={currentFilme.titulo}
                    onChange={handleChange}
                    placeholder="Título do Filme"
                    required
                />
                <Input
                    label="Descrição"
                    name="descricao"
                    value={currentFilme.descricao}
                    onChange={handleChange}
                    as="textarea"
                    rows={4}
                    placeholder="Breve descrição do filme"
                />
                <Input
                    label="Gênero"
                    name="genero"
                    value={currentFilme.genero}
                    onChange={handleChange}
                    as="select"
                    required
                >
                    <option value="Ação">Ação</option>
                    <option value="Comédia">Comédia</option>
                    <option value="Romance">Romance</option>
                    <option value="Terror">Terror</option>
                    <option value="Drama">Drama</option>
                    <option value="Ficção">Ficção</option>
                </Input>
                <Input
                    label="Classificação Indicativa"
                    name="classificacao"
                    value={currentFilme.classificacao}
                    onChange={handleChange}
                    as="select"
                    required
                >
                    <option value="L">L</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                </Input>
                <Input
                    label="Duração (min)"
                    name="duracao"
                    type="number"
                    value={currentFilme.duracao}
                    onChange={handleChange}
                    placeholder="Duração em minutos"
                    required
                />
                <Input
                    label="Data de Estreia"
                    name="estreia"
                    type="date"
                    value={currentFilme.estreia}
                    onChange={handleChange}
                    required
                />
            </Modal>
        </Container>
    );
};

export default Filmes;
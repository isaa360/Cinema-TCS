import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';

const Sessoes = () => {
     const [sessoes, setSessoes] = useState([]);
    const [filmesDisponiveis, setFilmesDisponiveis] = useState([]);
    const [salasDisponiveis, setSalasDisponiveis] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentSessao, setCurrentSessao] = useState({
        id: null,
        filmeId: '',
        salaId: '', 
        dataHora: '',
        preco: '',
        idioma: 'Dublado',
        formato: '2D'
    });

    // Carrega dados
    useEffect(() => {
        // Carrega filmes para select
        const storedFilmes = JSON.parse(localStorage.getItem('filmes')) || [];
        setFilmesDisponiveis(storedFilmes);

        // Carrega salas para select
        const storedSalas = JSON.parse(localStorage.getItem('salas')) || [];
        setSalasDisponiveis(storedSalas);

        // Carrega sessões pra listagem
        const storedSessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
        setSessoes(storedSessoes);
    }, []); 

    // Fechar modal
    const handleClose = () => {
        setShowModal(false);
        setCurrentSessao({
            id: null,
            filmeId: '',
            salaId: '',
            dataHora: '',
            preco: '',
            idioma: 'Dublado',
            formato: '2D'
        });
    };

    // Abrir modal
    const handleShow = (sessao = { id: null, filmeId: '', salaId: '', dataHora: '', preco: '', idioma: 'Dublado', formato: '2D' }) => {
        setCurrentSessao(sessao);
        setShowModal(true);
    };

    // Atualizar estado
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSessao(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = () => {
        if (!currentSessao.filmeId || !currentSessao.salaId || !currentSessao.dataHora || !currentSessao.preco) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        let updatedSessoes;
        if (currentSessao.id) {
            updatedSessoes = sessoes.map(s => s.id === currentSessao.id ? currentSessao : s);
        } else {
            updatedSessoes = [...sessoes, { ...currentSessao, id: sessoes.length > 0 ? Math.max(...sessoes.map(s => s.id)) + 1 : 1 }];
        }

        setSessoes(updatedSessoes);
        localStorage.setItem('sessoes', JSON.stringify(updatedSessoes));
        alert('Sessão salva com sucesso!'); 
        handleClose(); 
    };

    // Deletar sessão
    const handleDelete = (id) => {
        const updatedSessoes = sessoes.filter(s => s.id !== id);
        setSessoes(updatedSessoes);
        localStorage.setItem('sessoes', JSON.stringify(updatedSessoes));
        alert('Sessão excluída com sucesso!');
    };

    const getFilmeTitulo = (filmeId) => {
        const filme = filmesDisponiveis.find(f => f.id === parseInt(filmeId));
        return filme ? filme.titulo : 'Filme não encontrado';
    };

    const getSalaNome = (salaId) => {
        const sala = salasDisponiveis.find(s => s.id === parseInt(salaId));
        return sala ? sala.nome : 'Sala não encontrada';
    };

    // Interface
    return (
        <Container className="mt-4">
            <h2 className="mb-3">Gerenciamento de Sessões</h2>

            <Row className="mb-3">
                <Col>
                    <Button onClick={() => handleShow()}>
                        <i className="bi bi-plus-circle me-2"></i>Nova Sessão
                    </Button>
                </Col>
            </Row>

            <h3>Sessões Cadastradas</h3>
            {sessoes.length === 0 ? (
                <p>Nenhuma sessão cadastrada.</p>
            ) : (
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Filme</th>
                            <th>Sala</th>
                            <th>Data e Hora</th>
                            <th>Preço</th>
                            <th>Idioma</th>
                            <th>Formato</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessoes.map(sessao => (
                            <tr key={sessao.id}>
                                <td>{sessao.id}</td>
                                <td>{getFilmeTitulo(sessao.filmeId)}</td>
                                <td>{getSalaNome(sessao.salaId)}</td>
                                <td>{new Date(sessao.dataHora).toLocaleString('pt-BR')}</td>
                                <td>R$ {parseFloat(sessao.preco).toFixed(2)}</td>
                                <td>{sessao.idioma}</td>
                                <td>{sessao.formato}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(sessao)}>
                                        <i className="bi bi-pencil"></i> Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(sessao.id)}>
                                        <i className="bi bi-trash"></i> Excluir
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Modal */}
            <Modal
                show={showModal}
                handleClose={handleClose}
                title={currentSessao.id ? 'Editar Sessão' : 'Adicionar Nova Sessão'}
                footerButtons={[
                    { label: 'Cancelar', variant: 'secondary', onClick: handleClose },
                    { label: currentSessao.id ? 'Salvar Alterações' : 'Salvar Sessão', variant: 'primary', onClick: handleSubmit },
                ]}
            >
                {/* Select de Filmes */}
                <Input
                    label="Filme"
                    name="filmeId"
                    value={currentSessao.filmeId}
                    onChange={handleChange}
                    as="select"
                    required
                >
                    <option value="">Selecione um filme</option>
                    {filmesDisponiveis.map(filme => (
                        <option key={filme.id} value={filme.id}>{filme.titulo}</option>
                    ))}
                </Input>

                {/* Select de Salas */}
                <Input
                    label="Sala"
                    name="salaId"
                    value={currentSessao.salaId}
                    onChange={handleChange}
                    as="select"
                    required
                >
                    <option value="">Selecione uma sala</option>
                    {salasDisponiveis.map(sala => (
                        <option key={sala.id} value={sala.id}>{sala.nome}</option>
                    ))}
                </Input>

                <Input
                    label="Data e Hora"
                    name="dataHora"
                    type="datetime-local"
                    value={currentSessao.dataHora}
                    onChange={handleChange}
                    required
                />
                <Input
                    label="Preço"
                    name="preco"
                    type="number"
                    value={currentSessao.preco}
                    onChange={handleChange}
                    placeholder="Preço do ingresso"
                    required
                />
                <Input
                    label="Idioma"
                    name="idioma"
                    value={currentSessao.idioma}
                    onChange={handleChange}
                    as="select"
                >
                    <option value="Dublado">Dublado</option>
                    <option value="Legendado">Legendado</option>
                </Input>
                <Input
                    label="Formato"
                    name="formato"
                    value={currentSessao.formato}
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

export default Sessoes;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Modal from '../../components/common/Modal/Modal';

const Ingressos = () => {
    const [vendas, setVendas] = useState([]);

    const [sessoesDisponiveis, setSessoesDisponiveis] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [currentVenda, setCurrentVenda] = useState({
        id: null,
        sessaoId: '',
        cliente: '',
        cpf: '',
        assento: '',
        pagamento: 'Cartão' 
    });

    useEffect(() => {
        const storedSessoes = JSON.parse(localStorage.getItem('sessoes')) || [];
        const storedFilmes = JSON.parse(localStorage.getItem('filmes')) || [];
        const storedSalas = JSON.parse(localStorage.getItem('salas')) || [];

        const formattedSessoes = storedSessoes.map((sessao, index) => {
            const filme = storedFilmes.find(f => f.id === parseInt(sessao.filmeId));
            const sala = storedSalas.find(s => s.id === parseInt(sessao.salaId));
            const filmeTitulo = filme ? filme.titulo : "Filme não encontrado";
            const salaNome = sala ? sala.nome : "Sala não encontrada";
            const dataHoraFormatada = new Date(sessao.dataHora).toLocaleString('pt-BR');

            return {
                id: sessao.id,
                display: `${filmeTitulo} - ${salaNome} - ${dataHoraFormatada} (R$ ${parseFloat(sessao.preco).toFixed(2)})`,
                preco: parseFloat(sessao.preco) 
            };
        });
        setSessoesDisponiveis(formattedSessoes);
        const storedVendas = JSON.parse(localStorage.getItem('vendas')) || []; 
        setVendas(storedVendas);
    }, []);

    // Fechar modal
    const handleClose = () => {
        setShowModal(false);
        setCurrentVenda({
            id: null,
            sessaoId: '',
            cliente: '',
            cpf: '',
            assento: '',
            pagamento: 'Cartão'
        });
    };

    // Abrir modal edição
    const handleShow = (venda = { id: null, sessaoId: '', cliente: '', cpf: '', assento: '', pagamento: 'Cartão' }) => {
        setCurrentVenda(venda);
        setShowModal(true);
    };

    // Atualizar current 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentVenda(prevState => ({ ...prevState, [name]: value }));
    };

    // Envio de formulario
    const handleSubmit = () => {
        if (!currentVenda.sessaoId || !currentVenda.cliente || !currentVenda.assento || !currentVenda.pagamento) {
            alert('Por favor, preencha todos os campos obrigatórios (Sessão, Cliente, Assento, Pagamento).');
            return;
        }

        let updatedVendas;
        if (currentVenda.id) {
            // Atualizar venda existente.
            updatedVendas = vendas.map(v => v.id === currentVenda.id ? currentVenda : v);
        } else {
            // Adicionar nova venda.
            updatedVendas = [...vendas, { ...currentVenda, id: vendas.length > 0 ? Math.max(...vendas.map(v => v.id)) + 1 : 1 }];
        }

        setVendas(updatedVendas); 
        localStorage.setItem('vendas', JSON.stringify(updatedVendas)); 
        alert('Venda confirmada com sucesso!'); 
        handleClose();
    };

    // Deletar venda
    const handleDelete = (id) => {
        const updatedVendas = vendas.filter(v => v.id !== id);
        setVendas(updatedVendas); 
        localStorage.setItem('vendas', JSON.stringify(updatedVendas)); 
        alert('Venda de ingresso excluída com sucesso!');
    };

    const getSessaoDetalhesParaTabela = (sessaoId) => {
        const sessaoDisplay = sessoesDisponiveis.find(s => s.id === parseInt(sessaoId));
        return sessaoDisplay ? sessaoDisplay.display : 'Sessão Não Encontrada';
    };

    // Interface
    return (
        <Container className="mt-4">
            <h2 className="mb-3">Venda de Ingressos</h2>

            <Row className="mb-3">
                <Col>
                    <Button onClick={() => handleShow()}>
                        <i className="bi bi-plus-circle me-2"></i>Registrar Nova Venda
                    </Button>
                </Col>
            </Row>

            <h3>Vendas Registradas</h3>
            {vendas.length === 0 ? (
                <p>Nenhuma venda registrada.</p>
            ) : (
                <Table striped bordered hover responsive className="mt-3">
                    <thead>
                        <tr>
                            <th>ID Venda</th>
                            <th>Sessão</th>
                            <th>Cliente</th>
                            <th>CPF</th>
                            <th>Assento</th>
                            <th>Pagamento</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendas.map(venda => (
                            <tr key={venda.id}>
                                <td>{venda.id}</td>
                                <td>{getSessaoDetalhesParaTabela(venda.sessaoId)}</td>
                                <td>{venda.cliente}</td>
                                <td>{venda.cpf}</td>
                                <td>{venda.assento}</td>
                                <td>{venda.pagamento}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShow(venda)}>
                                        <i className="bi bi-pencil"></i> Editar
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(venda.id)}>
                                        <i className="bi bi-trash"></i> Excluir
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* Registrar/editar venda */}
            <Modal
                show={showModal}
                handleClose={handleClose}
                title={currentVenda.id ? 'Editar Venda de Ingresso' : 'Registrar Nova Venda'}
                footerButtons={[
                    { label: 'Cancelar', variant: 'secondary', onClick: handleClose },
                    { label: currentVenda.id ? 'Salvar Alterações' : 'Confirmar Venda', variant: 'primary', onClick: handleSubmit },
                ]}
            >
                {/* Select de Sessões */}
                <Input
                    label="Sessão"
                    name="sessaoId"
                    value={currentVenda.sessaoId}
                    onChange={handleChange}
                    as="select"
                    required
                >
                    <option value="">Selecione uma sessão</option>
                    {sessoesDisponiveis.map(sessao => (
                        <option key={sessao.id} value={sessao.id}>
                            {sessao.display}
                        </option>
                    ))}
                </Input>

                <Input
                    label="Nome do Cliente"
                    name="cliente"
                    value={currentVenda.cliente}
                    onChange={handleChange}
                    placeholder="Nome completo do cliente"
                    required 
                />
                <Input
                    label="CPF"
                    name="cpf"
                    value={currentVenda.cpf}
                    onChange={handleChange}
                    placeholder="Ex: 123.456.789-00"
                />
                <Input
                    label="Assento"
                    name="assento"
                    value={currentVenda.assento}
                    onChange={handleChange}
                    placeholder="Ex: A1, B10"
                    required 
                />

                <Input
                    label="Tipo de Pagamento"
                    name="pagamento"
                    value={currentVenda.pagamento}
                    onChange={handleChange}
                    as="select"
                >
                    <option value="Cartão">Cartão</option>
                    <option value="Pix">Pix</option>
                    <option value="Dinheiro">Dinheiro</option>
                </Input>
            </Modal>
        </Container>
    );
};

export default Ingressos;
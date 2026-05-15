const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

const pedidos = {};

app.get('/health', (req, res) => {
  res.json({ status: 'Serviço de Pedidos OK' });
});

app.post('/pedidos', async (req, res) => {
  const id = Date.now().toString();
  const { produto, quantidade, cliente } = req.body;

  try {
    const estoqueUrl = process.env.ESTOQUE_SERVICE_URL || 'http://servico-estoque:3000';
    const estoqueResponse = await axios.post(`${estoqueUrl}/reservar`, {
      produto,
      quantidade
    });

    if (estoqueResponse.data.disponivel) {
      pedidos[id] = {
        id,
        produto,
        quantidade,
        cliente,
        status: 'Pendente',
        criadoEm: new Date()
      };

      const pagamentoUrl = process.env.PAGAMENTO_SERVICE_URL || 'http://servico-pagamentos:3000';
      await axios.post(`${pagamentoUrl}/processar`, {
        pedidoId: id,
        cliente,
        valor: estoqueResponse.data.valor
      });

      pedidos[id].status = 'Confirmado';
      res.status(201).json(pedidos[id]);
    } else {
      res.status(400).json({ erro: 'Estoque insuficiente' });
    }
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao processar pedido', detalhe: error.message });
  }
});

app.get('/pedidos/:id', (req, res) => {
  const pedido = pedidos[req.params.id];
  if (pedido) {
    res.json(pedido);
  } else {
    res.status(404).json({ erro: 'Pedido não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Serviço de Pedidos rodando na porta ${PORT}`);
});
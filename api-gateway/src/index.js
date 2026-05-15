const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway OK' });
});

app.post('/pedidos', async (req, res) => {
  try {
    const pedidoServiceUrl = process.env.PEDIDOS_SERVICE_URL || 'http://servico-pedidos:3000';
    const response = await axios.post(`${pedidoServiceUrl}/pedidos`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao criar pedido', detalhe: error.message });
  }
});

app.get('/pedidos/:id', async (req, res) => {
  try {
    const pedidoServiceUrl = process.env.PEDIDOS_SERVICE_URL || 'http://servico-pedidos:3000';
    const response = await axios.get(`${pedidoServiceUrl}/pedidos/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ erro: 'Falha ao consultar pedido', detalhe: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
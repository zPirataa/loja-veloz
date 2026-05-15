const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Serviço de Pagamentos OK' });
});

app.post('/processar', (req, res) => {
  const { pedidoId, cliente, valor } = req.body;
  console.log(`Processando pagamento do pedido ${pedidoId} para ${cliente} no valor de R$ ${valor}`);

  setTimeout(() => {
    res.json({
      pedidoId,
      status: 'pago',
      transacaoId: `tx_${Date.now()}`,
      valor
    });
  }, 500);
});

app.listen(PORT, () => {
  console.log(`Serviço de Pagamentos rodando na porta ${PORT}`);
});
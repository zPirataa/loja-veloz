const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

const estoque = {
  'produto-001': { nome: 'Camiseta', quantidade: 100, valor: 49.90 },
  'produto-002': { nome: 'Calça Jeans', quantidade: 50, valor: 129.90 },
  'produto-003': { nome: 'Tênis', quantidade: 30, valor: 199.90 }
};

app.get('/health', (req, res) => {
  res.json({ status: 'Serviço de Estoque OK' });
});

app.post('/reservar', (req, res) => {
  const { produto, quantidade } = req.body;
  const item = estoque[produto];

  if (!item) {
    return res.json({ disponivel: false, motivo: 'Produto não encontrado' });
  }

  if (item.quantidade >= quantidade) {
    item.quantidade -= quantidade;
    res.json({
      disponivel: true,
      produto: item.nome,
      quantidade,
      valor: item.valor * quantidade
    });
  } else {
    res.json({
      disponivel: false,
      motivo: 'Estoque insuficiente',
      disponivelAtual: item.quantidade
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serviço de Estoque rodando na porta ${PORT}`);
});
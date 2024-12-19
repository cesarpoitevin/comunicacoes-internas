const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 10000;

app.use(express.json());
app.use(cors());

let comunicacoesMarcadas = [
  { numero: 1, assunto: 'Pedido', destino: 'Setor A', data: '2024-01-01' },
  { numero: 2, assunto: 'Consulta', destino: 'Setor B', data: '2024-01-02' },
];

// Rota para buscar todos os registros
app.get('/api/comunicacoes', (req, res) => {
  res.json(comunicacoesMarcadas);
});

// Rota para adicionar um registro
app.post('/api/comunicacoes', (req, res) => {
  const { numero, assunto, destino, data } = req.body;
  if (comunicacoesMarcadas.find(com => com.numero === numero)) {
    return res.status(400).json({ error: 'Número já existe' });
  }
  comunicacoesMarcadas.push({ numero, assunto, destino, data });
  res.status(201).send();
});

// Rota para desmarcar um registro
app.delete('/api/comunicacoes/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);
  comunicacoesMarcadas = comunicacoesMarcadas.filter(com => com.numero !== numero);
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

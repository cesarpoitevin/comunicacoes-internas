const express = require('express');
const cors = require('cors'); // Importa o CORS
const app = express();

const port = process.env.PORT || 10000; // Render usa a porta fornecida
app.use(express.json());
app.use(cors()); // Habilita CORS

let comunicacoesMarcadas = [];

// Rota para buscar números marcados
app.get('/api/comunicacoes', (req, res) => {
  res.json(comunicacoesMarcadas);
});

// Rota para marcar um número
app.post('/api/comunicacoes/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);
  if (!comunicacoesMarcadas.includes(numero)) {
    comunicacoesMarcadas.push(numero);
    res.status(200).send();
  } else {
    res.status(400).json({ error: 'Número já marcado' });
  }
});

// Rota para desmarcar um número
app.delete('/api/comunicacoes/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);
  comunicacoesMarcadas = comunicacoesMarcadas.filter(n => n !== numero);
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

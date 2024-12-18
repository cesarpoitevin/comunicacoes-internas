const express = require('express');
const cors = require('cors'); // Importa o CORS
const app = express();

const port = process.env.PORT || 10000; // Usa a porta fornecida pelo Render ou 10000 localmente

// Middleware
app.use(express.json());
app.use(cors()); // Habilita CORS

// Rota inicial para testar o servidor
app.get('/', (req, res) => res.send('Olá do Render!'));

// Variável para armazenar os números marcados
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

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

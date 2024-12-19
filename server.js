const express = require('express');
const cors = require('cors'); // Importa o CORS
const app = express();

const port = process.env.PORT || 10000; // Render usa a porta fornecida
app.use(express.json());
app.use(cors()); // Habilita CORS

// Dados iniciais
let comunicacoesMarcadas = [
  { numero: 1, assunto: "Orçamento", destino: "Financeiro", data: "2024-12-19" },
  { numero: 2, assunto: "Reunião", destino: "RH", data: "2024-12-20" }
];

// Rota para buscar números marcados
app.get('/api/comunicacoes', (req, res) => {
  res.json(comunicacoesMarcadas);
});

// Rota para marcar uma nova comunicação
app.post('/api/comunicacoes', (req, res) => {
  const { numero, assunto, destino, data } = req.body;
  if (!numero || !assunto || !destino || !data) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  if (comunicacoesMarcadas.find((c) => c.numero === numero)) {
    return res.status(400).json({ error: 'Número já existe.' });
  }

  comunicacoesMarcadas.push({ numero, assunto, destino, data });
  res.status(200).send();
});

// Rota para desmarcar um número
app.delete('/api/comunicacoes/:numero', (req, res) => {
  const numero = parseInt(req.params.numero);
  comunicacoesMarcadas = comunicacoesMarcadas.filter((c) => c.numero !== numero);
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

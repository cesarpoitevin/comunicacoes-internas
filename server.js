const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(cors());

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Dados iniciais
let comunicacoesMarcadas = [
  { numero: 1, assunto: "Entrega de documentos", destino: "RH", data: "2023-12-18" },
  { numero: 2, assunto: "Reunião", destino: "Sala 1", data: "2023-12-19" },
];

// Rota para buscar comunicações
app.get("/api/comunicacoes", (req, res) => {
  res.json(comunicacoesMarcadas);
});

// Rota para adicionar uma nova comunicação
app.post("/api/comunicacoes", (req, res) => {
  const { numero, assunto, destino, data } = req.body;
  comunicacoesMarcadas.push({ numero, assunto, destino, data });
  res.status(201).send();
});

// Rota para deletar uma comunicação
app.delete("/api/comunicacoes/:numero", (req, res) => {
  const numero = parseInt(req.params.numero);
  comunicacoesMarcadas = comunicacoesMarcadas.filter(c => c.numero !== numero);
  res.status(200).send();
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

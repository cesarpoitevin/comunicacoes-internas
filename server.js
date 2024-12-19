const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(cors());

let comunicacoesMarcadas = [
  {
    numero: 1,
    assunto: "Entrega de documentos",
    destino: "Setor Financeiro",
    data: "2023-12-19",
  },
  {
    numero: 2,
    assunto: "Reunião de equipe",
    destino: "Sala de Conferência",
    data: "2023-12-20",
  },
];

// Rota para buscar comunicações
app.get("/api/comunicacoes", (req, res) => {
  res.json(comunicacoesMarcadas);
});

// Rota para marcar uma nova comunicação
app.post("/api/comunicacoes", (req, res) => {
  const { numero, assunto, destino, data } = req.body;

  if (
    comunicacoesMarcadas.some((comunicacao) => comunicacao.numero === numero)
  ) {
    return res.status(400).json({ error: "Número já existe." });
  }

  comunicacoesMarcadas.push({ numero, assunto, destino, data });
  res.status(201).json({ message: "Comunicação adicionada com sucesso." });
});

// Rota para deletar uma comunicação
app.delete("/api/comunicacoes/:numero", (req, res) => {
  const numero = parseInt(req.params.numero);
  comunicacoesMarcadas = comunicacoesMarcadas.filter(
    (comunicacao) => comunicacao.numero !== numero
  );
  res.status(200).json({ message: "Comunicação removida com sucesso." });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

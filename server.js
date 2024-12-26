const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg"); // Importa o módulo pg para conexão ao banco

const app = express();
const port = process.env.PORT || 10000;

// Configurações para o banco de dados PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // URL do banco definida como variável de ambiente
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões seguras no Render
  },
});

app.use(express.json());
app.use(cors());

// Serve arquivos estáticos
app.use(express.static(path.join(__dirname)));

// Rota para buscar comunicações
app.get("/api/comunicacoes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comunicacoes ORDER BY numero");
    res.json(result.rows); // Envia as comunicações do banco
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar comunicações.");
  }
});

// Rota para adicionar uma nova comunicação
app.post("/api/comunicacoes", async (req, res) => {
  const { numero, assunto, destino, data } = req.body;
  try {
    await pool.query(
      "INSERT INTO comunicacoes (numero, assunto, destino, data) VALUES ($1, $2, $3, $4)",
      [numero, assunto, destino, data]
    );
    res.status(201).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao adicionar comunicação.");
  }
});

// Rota para deletar uma comunicação
app.delete("/api/comunicacoes/:numero", async (req, res) => {
  const numero = parseInt(req.params.numero);
  try {
    await pool.query("DELETE FROM comunicacoes WHERE numero = $1", [numero]);
    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao deletar comunicação.");
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 10000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("render.com") ? { rejectUnauthorized: false } : false,
});

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Rota de teste de conexão
app.get("/api/test-db", async (req, res) => {
  try {
    await pool.query("SELECT 1"); // Query simples para verificar a conexão
    res.status(200).json({ message: "Conexão com o banco de dados OK!" });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    res.status(500).json({ error: "Erro ao conectar ao banco de dados." });
  }
});

//Rotas existentes (com tratamento de erros mais robusto)
app.get("/api/comunicacoes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM comunicacoes ORDER BY numero");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar comunicações:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/api/comunicacoes", async (req, res) => {
  const { numero, assunto, destino, data } = req.body;
  try {
    await pool.query(
      "INSERT INTO comunicacoes (numero, assunto, destino, data) VALUES ($1, $2, $3, $4)",
      [numero, assunto, destino, data]
    );
    res.status(201).json({ message: "Comunicação adicionada com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar comunicação:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.delete("/api/comunicacoes/:numero", async (req, res) => {
  const numero = parseInt(req.params.numero);
  try {
    const result = await pool.query("DELETE FROM comunicacoes WHERE numero = $1", [numero]);
    if (result.rowCount === 0) {
        return res.status(404).json({ message: "Comunicação não encontrada" });
    }
    res.status(200).json({ message: "Comunicação excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar comunicação:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
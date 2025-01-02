require('dotenv').config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const port = process.env.PORT || 10000;

// Configuração do SQLite
let db;
async function initializeDB() {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS comunicacoes (
      numero INTEGER PRIMARY KEY,
      assunto TEXT NOT NULL,
      destino TEXT NOT NULL,
      data TEXT NOT NULL
    )
  `);
}

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Rotas
app.get("/api/comunicacoes", async (req, res) => {
  try {
    const comunicacoes = await db.all("SELECT * FROM comunicacoes ORDER BY numero");
    res.json(comunicacoes);
  } catch (error) {
    console.error("Erro ao buscar comunicações:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/api/comunicacoes", async (req, res) => {
  const { numero, assunto, destino, data } = req.body;
  try {
    await db.run(
      "INSERT INTO comunicacoes (numero, assunto, destino, data) VALUES (?, ?, ?, ?)",
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
    const result = await db.run("DELETE FROM comunicacoes WHERE numero = ?", numero);
    if (result.changes === 0) {
      return res.status(404).json({ message: "Comunicação não encontrada" });
    }
    res.json({ message: "Comunicação excluída com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar comunicação:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Inicializa o banco e inicia o servidor
initializeDB().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}).catch(err => {
  console.error("Erro ao inicializar o banco de dados:", err);
});
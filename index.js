const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./banco_de_dados.db', err => {
  if (err) console.error(err.message);
  console.log('Conectado ao banco de dados SQLite.');
});

db.run(
  `CREATE TABLE IF NOT EXISTS Alunos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL
)`,
  err => {
    if (err) console.error(err.message);
    console.log('Tabela Alunos criada.');
  }
);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.get('/alunos', (req, res) => {
  db.all('SELECT * FROM Alunos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/alunos', (req, res) => {
  const { nome } = req.body;
  db.run('INSERT INTO Alunos (nome) VALUES (?)', [nome], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, message: 'Aluno criado com sucesso!' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

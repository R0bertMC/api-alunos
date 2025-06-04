const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Adicione esta linha
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Corrija aqui

const db = new sqlite3.Database('./banco_de_dados.db', err => {
  if (err) console.error(err.message);
  else console.log('Conectado ao banco de dados SQLite.');
});

db.run(
  `CREATE TABLE IF NOT EXISTS Alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL
  )`,
  err => {
    if (err) console.error(err.message);
    else console.log('Tabela Alunos criada.');
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

// Atualiza apenas o nome do aluno
app.put('/alunos/:id', (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ error: 'Forneça o campo nome para atualizar.' });
  }
  db.run('UPDATE Alunos SET nome = ? WHERE id = ?', [nome, id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar aluno: " + err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Aluno não encontrado para atualização.' });
    }
    res.json({ message: 'Aluno atualizado com sucesso!', changes: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
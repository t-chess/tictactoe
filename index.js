import express from "express";
import cors from "cors";
import Database from "better-sqlite3";

export const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = './games.db';
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS games (id INTEGER NOT NULL PRIMARY KEY, rows INTEGER NOT NULL, cols INTEGER NOT NULL, numToWin INTEGER NOT NULL,
    history TEXT NOT NULL, created INTEGER NOT NULL 
  );
`);
const getAllStmt = db.prepare(`SELECT * FROM games`); 
const insertStmt = db.prepare(`INSERT INTO games (rows, cols, numToWin, history, created) VALUES (@rows, @cols, @numToWin, @history, @created)`);
const updateStmt = db.prepare(`UPDATE games SET rows=@rows, cols=@cols, numToWin=@numToWin, history=@history, created=@created WHERE id=@id`);
const getStmt = db.prepare(`SELECT * FROM games WHERE id = ?`);
const deleteStmt = db.prepare(`DELETE FROM games WHERE id = ?`);

app.get('/api/games', (req, res) => {
  const data = getAllStmt.all();
  res.json(data);
});
app.get('/api/games/:id', (req, res) => {
  const id = String(req.params.id).trim();
  if (!id) return res.status(400).json({ error: 'no id' });
  const row = getStmt.get(id);
  if (!row) return res.status(404).json({ error: 'not found' });
  const data = {
    id: row.id,
    rows: row.rows,
    cols: row.cols,
    numToWin: row.numToWin,
    history: JSON.parse(row.history),
    step: row.step,
    created: row.created
  };
  res.json(data);
});

app.post('/api/games/new', (req, res) => {
  const { rows, cols, numToWin, history } = req.body || {};
  // todo validation
  const created = Date.now();
  const data = insertStmt.run({rows,cols,numToWin,history: JSON.stringify(history),created});
  res.json({ ok: true, id:data.lastInsertRowid });
});
app.post('/api/games/edit', (req, res) => {
  const { id, rows, cols, numToWin, history } = req.body || {};
  // todo validation
  const created = Date.now();
  const data = updateStmt.run({id,rows,cols,numToWin,history: JSON.stringify(history),created});
  res.json({ ok: true });
});
app.get('/api/games/delete/:id', (req, res) => {
  const id = String(req.params.id).trim();
  const data = deleteStmt.run(id);
  res.json(data);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API on http://localhost:${PORT}`);
});

import Database from "better-sqlite3";
const DB_PATH = './games.db';
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS games (id INTEGER NOT NULL PRIMARY KEY, rows INTEGER NOT NULL, cols INTEGER NOT NULL, numToWin INTEGER NOT NULL,
    history TEXT NOT NULL, created INTEGER NOT NULL 
  );
`);

export const statements = {
    getAll: db.prepare(`SELECT * FROM games`),
    insert: db.prepare(`INSERT INTO games (rows, cols, numToWin, history, created) VALUES (@rows, @cols, @numToWin, @history, @created)`),
    update: db.prepare(`UPDATE games SET rows=@rows, cols=@cols, numToWin=@numToWin, history=@history WHERE id=@id`),
    getOne: db.prepare(`SELECT * FROM games WHERE id = ?`),
    delete: db.prepare(`DELETE FROM games WHERE id = ?`)
}
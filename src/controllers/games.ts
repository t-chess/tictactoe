import { type Request, type Response } from "express";
import { type DBGameRow, type GameData } from "../types";
import { statements } from "../db";
import { toGameData, validateEditBody, validateNewBody } from "../helpers";

export const getGames = (_: Request, res: Response<{ok:true,body:GameData[]} | { error: string }>) => {
    let data = statements.getAll.all() as DBGameRow[];
    res.json({ ok: true, body:data.map(row=>toGameData(row))});
};

export const getGame = (req: Request, res: Response<{ok:true,body:GameData} | { error: string }>) => {
    const id = String(req.params.id).trim();
    if (!id) return res.status(400).json({ error: 'no game id given' });
    const row = statements.getOne.get(id) as DBGameRow;
    if (!row) return res.status(404).json({ error: 'invalid game id' });
    res.json({ ok: true, body:toGameData(row)});
};

export const createGame = (req: Request, res: Response<{ ok: true, body:number|bigint } | { error: string }>) => {
    const v = validateNewBody(req.body);
    if (!v.ok) return res.status(422).json({ error: v.error });
    const { rows, cols, numToWin, history } = v.data || {};
    const created = Date.now();
    const data = statements.insert.run({rows,cols,numToWin,history: JSON.stringify(history),created});
    res.json({ ok: true, body:data.lastInsertRowid });
};

export const editGame = (req: Request, res: Response<{ ok: true } | { error: string }>) => {
    const v = validateEditBody(req.body);
    if (!v.ok) return res.status(422).json({ error: v.error });
    const { id, rows, cols, numToWin, history } = v.data || {};
    const info = statements.update.run({id,rows,cols,numToWin,history: JSON.stringify(history)});
    if (info.changes === 0) return res.status(404).json({ error: "game not found" });
    res.json({ ok: true });
};

export const deleteGame = (req: Request, res: Response<{ ok: true } | { error: string }>) => {
    const id = String(req.params.id).trim();
    if (!id) return res.status(400).json({ error: 'invalid game id' });
    statements.delete.run(id);
    res.json({ ok: true });
};
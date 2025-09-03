import type { DBGameRow, EditGameBody, GameData, HistoryData, NewGameBody } from './types';

export const parseId = (raw: unknown): number | null => {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
};

export const toGameData = (row: DBGameRow): GameData => {
  let history: HistoryData[] = [];
  try {
    const parsed = JSON.parse(row.history);
    if (Array.isArray(parsed)) history = parsed as HistoryData[];
  } catch {}
  return {
    id: row.id,
    rows: row.rows,
    cols: row.cols,
    numToWin: row.numToWin,
    history,
    created: row.created,
  };
};
export const isBoard = (b: unknown): b is (string | null)[] =>
  Array.isArray(b) && b.every((v) => v === null || typeof v === 'string');

export const isHistoryItem = (h: unknown): h is HistoryData =>
  !!h &&
  typeof h === 'object' &&
  isBoard((h as any).board) &&
  ((h as any).winner === undefined || (h as any).winner === 'X' || (h as any).winner === 'O');

export const isHistory = (h: unknown): h is HistoryData[] => Array.isArray(h) && h.every(isHistoryItem);

export const validateNewBody = (b: any): { ok: true; data: NewGameBody } | { ok: false; error: string } => {
  if (!b || typeof b !== 'object') return { ok: false, error: 'paylaod must be an object' };

  const { rows, cols, numToWin, history } = b;
  if (!Number.isInteger(rows) || rows < 1) return { ok: false, error: 'rows must be an integer' };
  if (!Number.isInteger(cols) || cols < 1) return { ok: false, error: 'cols must be an integer' };
  if (!Number.isInteger(numToWin) || numToWin < 1 || numToWin > Math.max(rows, cols))
    return { ok: false, error: 'numToWin must be an integer' };
  if (!isHistory(history)) return { ok: false, error: 'history must be an array of {board, winner?}' };

  return { ok: true, data: { rows, cols, numToWin, history } };
};

export const validateEditBody = (b: any): { ok: true; data: EditGameBody } | { ok: false; error: string } => {
  const base = validateNewBody(b);
  if (!base.ok) return base;
  const id = parseId(b.id);
  if (id === null) return { ok: false, error: 'id must be a non-negative integer' };
  return { ok: true, data: { id, ...base.data } };
};

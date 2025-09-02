export type BoardData = (string|null)[];

export type HistoryData = {
    board: BoardData;
    winner?: "X" | "O";
}

export type GameData = {
    id?:number;
    rows:number;
    cols:number;
    numToWin:number;
    history:HistoryData[];
    created?:number;
}

export type DBGameRow = {
    id: number;
    rows: number;
    cols: number;
    numToWin: number;
    history: string;
    created: number;
};

export type NewGameBody = Omit<GameData, "id" | "created">;

export type EditGameBody = GameData & { id: number };
export type BoardData = (string|null)[];

export type HistoryData = {
    board: BoardData;
    winner?:string;
}

export type GameData = {
    id?:number;
    rows:number;
    cols:number;
    numToWin:number;
    history:HistoryData[];
    created:number;
}
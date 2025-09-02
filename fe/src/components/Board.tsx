import { useEffect, useMemo, useState } from 'react';
import Cell from './Cell';
import Input from './Input';
import type { BoardData, HistoryData } from '../../../src/types';
import { useAPI } from '../hooks/useApi';

type BoardProps = {
    id?:number|null;
    onDelete:() => void;
    onCreate:(value:number) => void;
}

const Board = ({id,onDelete=()=>{},onCreate=()=>{}}:BoardProps) => {
    const {post,get} = useAPI();  
    const [rows,setRows] = useState<number>(3);
    const [cols,setCols] = useState<number>(3);
    const [numToWin,setNumToWin] = useState<number>(3);

    const cells = useMemo(() => Array.from({ length: rows * cols }, (_, i) => i), [rows, cols]);
    const emptyBoard = (r:number, c:number):HistoryData => ({board:Array(r * c).fill(null)});

    const [history,setHistory] = useState<HistoryData[]>([emptyBoard(rows,cols)]);
    const [step,setStep] = useState<number>(0);
    const xIsNext = step % 2 === 0;
    
    const board = history[step].board;
    const winner = history[step].winner;
    const inPast = history.length>1&&step!==history.length-1;

    const handleClick = (i:number) => {
        if (winner||board[i]||inPast) return;
        const who = xIsNext?"X":"O";
        const nextState = board.toSpliced(i,1,who);
        const nextStep = step + 1;
        setStep(nextStep); 
        setHistory(prev=>[...prev.slice(0,nextStep),{board:nextState,winner:check(i,nextState,who)?who:undefined}]);
    }
    const check = (index:number,state:BoardData,who:string) => {
        const target = who.repeat(numToWin);
        const rs = Math.floor(index/cols)*cols; // row start
        const cs = index-rs; // col start
        
        let row = "";
        for (let j = 0; j < cols; j++) row += state[rs+j] ?? "_";
        if (row.includes(target)) return true;

        let col = "";
        for (let i = 0; i < rows; i++) col += state[cs+i*cols]??"_";
        if (col.includes(target)) return true;
        
        // diag lt to rb
        let dr1 = Math.floor(index / cols), dc1 = cs;
        while (dr1 > 0 && dc1 > 0) { dr1--; dc1--; }
        let diag1 = "";
        while (dr1 < rows && dc1 < cols) { diag1 += state[dr1 * cols + dc1]??"_"; dr1++; dc1++;}
        if (diag1.includes(target)) return true;

        // diag lb to rt
        let dr2 = Math.floor(index / cols), dc2 = cs;
        while (dr2 < rows - 1 && dc2 > 0) { dr2++; dc2--; }
        let diag2 = "";
        while (dr2 >= 0 && dc2 < cols) { diag2 += state[dr2*cols+dc2]??"_"; dr2--; dc2++; }
        if (diag2.includes(target)) return true;
        return false;
    }
    const resetHistory = () => {
        setStep(0);
        setHistory([emptyBoard(rows,cols)]);
    }
    const reset = () => {
        setRows(3);
        setCols(3);
        setNumToWin(3);
        setStep(0);
        setHistory([emptyBoard(rows,cols)]);
    }

    useEffect(()=>{
        if (!id) {
            reset();
        } else {
            getGame();
        }
    },[id]);

    const getGame = async () => {
        get("/api/games/"+id).then(response=>{
            setRows(response.rows);
            setCols(response.cols);
            setNumToWin(response.numToWin);
            setHistory(response.history);
            setStep(response.history.length-1);
        })
    }
    const saveGame = async () => {
        const endpoint = id ? "/api/games/edit" :"/api/games/new";
        post(endpoint,{id,rows,cols,numToWin,history}).then(response=>{
            console.log(response);
            !id&&onCreate(response);
        })
    }
    const deleteGame = async () => {
        get("/api/games/delete/"+id).then(()=>{
            onDelete();
        })
    }

    return (
        <div className='p-4'>
            <h2 className='text-2xl pb-4 text-center'>{id?`Game #${id}`:"New game"}</h2>
            <div className='flex justify-center gap-4 pb-4'>
                <button onClick={saveGame}>{id?"Update game":"Save game"}</button>
                {id?<button onClick={deleteGame}>Delete</button>:<button onClick={reset}>Clear</button>}
                <p>{inPast?"inPast":"not inPast"}</p>
            </div>
            <div className='p-2'>
                <div className='grid border' style={{gridTemplateRows:`repeat(${rows},100px)`,gridTemplateColumns:`repeat(${cols},100px)`}}>
                    {cells.map(i =><Cell key={i} value={board[i]} onClick={()=>handleClick(i)} />)}
                </div>
                <div className='flex flex-col gap-8'>
                    <div className='flex gap-4'>
                        <Input name="rows" label="Rows" value={rows} max={10} disabled={history.length>1} onChange={(v)=>{setRows(Number(v));resetHistory()}} />
                        <Input name="cols" label="Cols" value={cols} max={10} disabled={history.length>1} onChange={(v)=>{setCols(Number(v));resetHistory()}} />
                        <Input name="numToWin" label="To win" value={numToWin} disabled={history.length>1} max={Math.min(rows,cols)} onChange={(v)=>{setNumToWin(Number(v));resetHistory()}} />
                    </div>
                    <strong className='border-t border-b'>{winner?`Winner: ${winner}`:`Now: ${xIsNext?"X":"O"}`}</strong>
                    <div className='flex flex-col items-start'>
                        {history.map((_,i)=><button key={i} onClick={()=>setStep(i)}>{i===0?"Go to start":`Go to move #${i}`}</button>)}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Board;
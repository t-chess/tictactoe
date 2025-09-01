import { useEffect, useState } from 'react';
import Cell from './components/Cell';

// ukladat hry vcetne historie 

function App() {
  const [rows,setRows] = useState(3);
  const [cols,setCols] = useState(3);
  const [cells, setCells] = useState([]);
  const [numToWin,setNumToWin] = useState(3);

  const [move,setMove] = useState(0);
  const xIsNext = move % 2 === 0;

  const [data,setData] = useState([]);
  const [history,setHistory] = useState([]);
  const [winner,setWinner] = useState(null);

  const handleClick = (i) => {
    if (winner||data[i]) return;
    setMove(m=>m+1);
    const newState = data.toSpliced(i,1,xIsNext?"X":"O");
    setData(newState);
    setHistory(prev=>[...prev.slice(0,move+1),newState]);
    check(i,newState);
  }
  const check = (index,state) => {
    const findStr = (str,who) => {
      if (str.includes(who.repeat(numToWin))) {
        setWinner(who);
        return who;
      } else return false;
    };
    // row start
    const rs = Math.floor(index/cols)*cols;
    const row = state.slice(rs,rs+cols).map(v=>v?v:"_").join("");
    if (findStr(row,"X")||findStr(row,"O")) return;

    // col start
    const cs = index-rs;
    const col = Array(rows).fill(null).map((_,ix)=>state[cs+ix*cols]??"_").join("");
    if (findStr(col,"X")||findStr(col,"O")) return;
    
    // diagonal lt to rb
    let ds1 = rs - cols*cs;
    let len1 = Math.min(rows,cols);
    if (ds1<0) ds1=-ds1/cols;
    const diag1 = Array(len1).fill(null).map((_,ix)=>state[ds1+ix*(cols+1)]??"_").join("");
    if (findStr(diag1,"X")||findStr(diag1,"O")) return;

    // diagonal lb to rt
    let ds2 = rs + cols*cs;
    let len2 = Math.min(rows,cols);
    if (ds2>=state.length) ds2 = ds2-(cols-1) * ((ds2-state.length)/cols + 1);
    const diag2 = Array(len2).fill(null).map((_,ix)=>state[ds2-ix*(cols-1)]??"_").join("");
    if (findStr(diag2,"X")||findStr(diag2,"O")) return;
    
    // console.log(ds1,diag1,ds2,diag2);
  }

  const backTo = (i) => {
    setMove(i);
    setData(history[i]);
  }
  const reset = () => {
    setMove(0);
    const cells = Array(rows).fill(null).map(()=>Array(cols).fill(null)).flat().map((_,i)=>i);
    setCells(cells);
    setData(cells.map(c=>null));
    setHistory([cells.map(c=>null)]);
    setWinner(null);
  }

  useEffect(()=>{
    reset();
  },[rows,cols,numToWin]);

  return (
    <div className='flex gap-8'>
      <div className='grid' style={{gridTemplateRows:`repeat(${rows},100px)`,gridTemplateColumns:`repeat(${cols},100px)`}}>
        {cells.map(i =><Cell key={i} i={i} value={data[i]} onClick={()=>handleClick(i)} />)}
      </div>
      <div className='flex flex-col gap-8'>
        <div className='flex gap-4 [&_input]:border'>
          <label><p>Rows</p><input type="number" value={rows} onChange={(e)=>setRows(Number(e.target.value))} /></label>
          <label><p>Cols</p><input type="number" value={cols} onChange={(e)=>setCols(Number(e.target.value))} /></label>
          <label><p>To win</p><input type="number" value={numToWin} onChange={(e)=>setNumToWin(Number(e.target.value))} /></label>
        </div>
        <strong className='border-t border-b'>{winner?`Winner: ${winner}`:`Now: ${xIsNext?"X":"O"}`}</strong>
        <div className='flex flex-col items-start'>
          {history.map((_,i)=><button className='hover:bg-slate-100 cursor-pointer' key={i} onClick={()=>backTo(i)}>{i===0?"Go to start":`Go to move #${i}`}</button>)}
        </div>
      </div>
    </div>
  )
}

export default App;

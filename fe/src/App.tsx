import { useEffect, useState } from "react";
import axios from "axios";
import { APIURL } from "./utils";
import Board from "./components/Board";
import type { GameData } from "./types";

const App = () => {
  const [games,setGames] = useState<GameData[]>();
  const [active, setActive] = useState<number|null|undefined>(null);
  const getGames = () => {
    axios.get(APIURL+"/api/games").then(response=>{
      console.log(response.data);
      setGames(response.data);
    })
  }
  useEffect(()=>{
    getGames();
  },[])
  return (
    <main className="flex gap-8 [&_button]:block [&_button]:cursor-pointer [&_button]:hover:bg-slate-100">
      <div className="min-w-96 border-r-2">
        {games?.length?<>
          <p>Saved games:</p>
          {games.map(g=><button key={g.id} onClick={()=>setActive(g.id)} >{`Game #${g.id}`}</button>)}
        </>:"No saved games"}
        <button onClick={()=>setActive(null)}>New game</button>
      </div>
      <Board id={active} onDelete={()=>{getGames();setActive(null)}} onCreate={(id:number)=>{getGames();setActive(id)}} />
    </main>
  )
  
}

export default App;

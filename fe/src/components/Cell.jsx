const Cell = ({i,value,onClick}) => {
    return <button className="border border-black" onClick={onClick}>{value}</button>
}
export default Cell;
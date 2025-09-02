const Input = ({name,label,type="number",value,onChange=()=>{}, ...rest}) => {
    return <label><p>{label}</p><input type={type} value={value} onChange={(e)=>onChange(e.target.value)} {...rest} /></label>
}
export default Input;
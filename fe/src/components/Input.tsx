import type { InputHTMLAttributes } from "react";

type InputProps = {
    name:string;
    label:string;
    type?:string;
    value:number|string;
    onChange?: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

const Input = ({name,label,type="number",value,onChange=()=>{}, ...rest}:InputProps) => {
    return <label><p>{label}</p><input className="border w-16" type={type} value={value} onChange={(e)=>onChange(e.target.value)} {...rest} /></label>
}
export default Input;
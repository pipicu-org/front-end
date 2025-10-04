
import Image from "next/image";

interface InputProps {
    value: string;
    icon: string;
}

const Input = ({value, icon} : InputProps) => {
    return (
        <div className="flex items-center gap-2 rounded-full pl-2 pr-2 bg-primary/20">
            <Image src={`/icons/${icon}.svg`} alt="" width={15} height={15} className="w-[15px] h-[15px]" />
            <input type="text" name="" id="" className="w-full focus:outline-none focus:ring-0" value={value}/>
        </div>
    )
}


export default Input;
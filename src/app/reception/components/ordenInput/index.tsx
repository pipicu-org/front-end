
interface OrdenInputProps {
    value: string;
    icon: string
}

const OrdenInput = ({value, icon} : OrdenInputProps) => {
    return (
        <div className="flex items-center gap-2 rounded-full pl-2 pr-2 bg-primary/20">
            <img src={"../icons/" + icon + ".png"} alt="" className="w-[15px] h-[15px] opacity-30" />
            <input type="text" name="" id="" className=" w-full" value={value} />
        </div>
    )
}


export default OrdenInput;
import { Button } from "@heroui/react";

interface IconButtonProps{
    nombre: string;
    icon: string;
}

const IconButton = ({nombre, icon, } : IconButtonProps) => {
    const style = {
        background: `linear-gradient(
                      135deg,
                      rgba(161, 161, 161, 0.5) 0%,
                      rgba(161, 161, 161, 0.05) 66%,
                      rgba(161, 161, 161, 0.6) 100%
                    ), #ffffff`
    }

    return (
        <Button style={style} className=" flex flex-col items-center justify-center w-[90px] h-[70px] rounded-2xl ">
            <img src={`./icons/${icon}.svg`} alt="" className="w-[20px] " />
            <span className="text-dark">{nombre}</span>
        </Button>
    )
}

export default IconButton;

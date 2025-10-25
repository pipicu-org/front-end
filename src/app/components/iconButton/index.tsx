import { Button } from "@heroui/react";
import Image from "next/image";

interface IconButtonProps{
    nombre?: string;
    icon?: string;
    onPress?: () => void;
    selected?: boolean;
}

const IconButton = ({nombre, icon, onPress, selected} : IconButtonProps) => {
    const style = {
        background: `linear-gradient(
                      135deg,
                      rgba(161, 161, 161, 0.5) 0%,
                      rgba(161, 161, 161, 0.05) 66%,
                      rgba(161, 161, 161, 0.6) 100%
                    ), #ffffff`
    }

    return (
        <Button style={style} className={`flex flex-col min-w-auto min-h-auto items-center justify-center w-full rounded-2xl  py-7 ${selected ? 'ring-2 ring-blue-500' : ''}`} onPress={onPress}>
            {icon && <Image src={`/icons/${icon}.svg`} alt={nombre || icon} width={20} height={20} className="w-[20px] min-w-[20px]" loading="lazy" />}
            {nombre && <span className="text-dark">{nombre}</span>}
        </Button>
    )
}

export default IconButton;

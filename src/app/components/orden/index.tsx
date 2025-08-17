"use client";
import { Button } from "@heroui/react";
import Order from "@/entities/order";
import { Dispatch, SetStateAction } from "react";
interface OrdenProps {
    orden: Order;
    setOrdenActiva?: Dispatch<SetStateAction<Order | null>>; // 
}


const Orden = ({orden, setOrdenActiva}: OrdenProps) => {
    return (
        <>
        <Button
                style={{
                    background: `linear-gradient(
                      135deg,
                      rgba(161, 161, 161, 0.5) 0%,
                      rgba(161, 161, 161, 0.05) 66%,
                      rgba(161, 161, 161, 0.6) 100%
                    ), #ffffff`
                }} 
                className="min-w-fit aspect-square w-[90px] h-[90px] rounded-xl p-3 text-center drop-shadow-orden flex flex-col"
                onClick={() => setOrdenActiva?.(orden)} >
                    <div>
                        <span className="text-primary text-xs text-wrap m-0 p-0 leading-none ">{orden.client}</span>
                        <h4 className="font-bold text-primary text-sm ">{orden.deliveryTime}</h4>
                        <h1 className="font-black text-3xl text-primary">#{orden.id}</h1>
                    </div>
        </Button>
        </>
    )
}

export default Orden;
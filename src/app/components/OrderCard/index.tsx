"use client";
import { Button } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";

interface OrdenProps {
    orden: IOrder;
    cambiarOrden?: (nuevaOrden: IOrder) => void;
    kitchen?: boolean;
}

const OrderCard = ({ orden, cambiarOrden, kitchen }: OrdenProps) => {
    return (
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
            onClick={() => cambiarOrden?.(orden)} >
            {!kitchen ? (
                <div className="max-w-xs">
                    <span className="text-primary text-xs block whitespace-normal leading-none ">{orden.client}</span>
                    <h4 className="font-bold text-primary text-sm">{orden.deliveryTime}</h4>
                    <h1 className="font-black text-3xl text-primary">#{orden.id}</h1>
                </div>
            ) : (

                <div>
                    <h4 className="font-bold text-primary text-sm">{orden.client}</h4>
                    <span className="text-xs text-gray-500">{orden.deliveryTime}</span>
                </div>
            )}
        </Button>
    )
}

export default OrderCard;

"use client";
import { Button } from "@heroui/react";
import Order from "@/entities/order";
import { Dispatch, SetStateAction } from "react";

interface OrdenProps {
    orden: Order;
    setState?: Dispatch<SetStateAction<Order | null>>;
}

const OrderCard = ({ orden, setState }: OrdenProps) => {
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
            onClick={() => setState?.(orden)} >
            
        </Button>
    )
}

export default OrderCard;

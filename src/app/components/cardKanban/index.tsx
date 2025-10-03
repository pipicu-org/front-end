"use client";

import OrderCard from "../OrderCard";
import { Dispatch, SetStateAction } from "react";

interface CardKanbanProps {
    estado: string,
    ordenes: IOrder[];
    cambiarOrden?: (nuevaOrden: IOrder) => void;
}

const CardKanban = ( {cambiarOrden ,estado, ordenes = []} : CardKanbanProps) => {
    return (
        <div className="rounded-xl p-3 bg-[#290D1B0D]">
            {/* ~~~ Header ~~~ */}
            <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                    {/* ~~~ Pelotita ~~~ */}
                    <div className="w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_5px_rgba(255,255,255,1)]"></div>
                    <h2 className="font-bold">{estado}</h2>
                </div>
                
                <span className="font-bold">{ordenes.length}</span>
            </div>
            {/* ~~~ Row ~~~ */}
            <div className="mt-5 flex gap-5  overflow-hidden rounded-xl">
                {
                    ordenes.map((orden) => (
                        <OrderCard
                            key={orden.id}
                            orden={orden}
                            cambiarOrden={cambiarOrden}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default CardKanban;

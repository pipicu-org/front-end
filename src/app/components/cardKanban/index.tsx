"use client";
import Orden from "../orden/index";
import Order from "../../../entities/order"
import { Dispatch, SetStateAction } from "react";

interface CardKanbanProps {
    estado: String,
    ordenes?: Order[];
    setOrdenActiva?: Dispatch<SetStateAction<Order | null>>; // 
}

const CardKanban = ( {setOrdenActiva ,estado, ordenes = []} : CardKanbanProps) => {



    return (
        <>
        <div className="rounded-xl p-3 bg-[#290D1B0D] mt-5">
            {/* ~~~ Header ~~~ */}
            <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                    {/* ~~~ Pelotita ~~~ */}
                    <div className="w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_5px_rgba(255,255,255,1)]"></div>
                    <h2 className="font-bold">{estado}</h2>
                </div>
                
                {/* <span className="font-bold">{ordenes.length}</span> */}
            </div>
            
            {/* ~~~ Row ~~~ */}
            <div className="mt-5 flex gap-5  overflow-hidden rounded-xl">
                {
                    ordenes.map((orden) => (
                        <Orden
                            key={orden.id}
                            orden={orden}
                            setState={setOrdenActiva}
                        />
                    ))
                }
            </div>
        </div>
        </>
    )
}

export default CardKanban;

"use client";
import Orden from "../orden/index";

const CardKanban = () => {

    return (
        <>
        <div className="rounded-xl p-3 bg-[#290D1B0D] mt-5">
            {/* ~~~ Header ~~~ */}
            <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                    {/* ~~~ Pelotita ~~~ */}
                    <div className="w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_5px_rgba(255,255,255,1)]"></div>
                    <h2 className="font-bold">Creados</h2>
                </div>
                
                <span className="font-bold">3</span>
            </div>
            
            {/* ~~~ Row ~~~ */}
            <div className="mt-5 flex gap-5  overflow-hidden rounded-xl">
                <Orden/>
                <Orden/>
                <Orden/>
                <Orden/>
                <Orden/>
                <Orden/>
                <Orden/>
                <Orden/>
                <Orden/>
                <Orden/>
                <Orden/>
            </div>
        </div>
        </>
    )
}

export default CardKanban;

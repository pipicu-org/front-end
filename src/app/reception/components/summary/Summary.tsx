import CardKanban from "@/app/components/cardKanban";
import { Dispatch, SetStateAction } from "react";
import Order from "@/entities/order";
import { Button } from "@heroui/react";
import { useState } from "react";

interface SummaryProps {
    setState?: Dispatch<SetStateAction<Order | null>>; 
    creados: Order[];
    pendientes: Order[];
    preparados: Order[];
    enCamino: Order[];
    entregados: Order[];
    cancelados: Order[];
}

const Summary = ({setState, creados, pendientes, preparados, enCamino, entregados, cancelados}: SummaryProps) => {

    const [modal, setModal] = useState(true);

    return (
        <div className="flex flex-col h-full">
            <h1 className="font-poppins font-black text-4xl text-primary">RESUMEN</h1>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between mt-4">
                    <div className="inline-flex text-sm ">
                        <Button onClick={ () => setModal(true)} className="inline-flex items-center h-[30px] bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-l-full">En curso</Button>
                        <Button onClick={ () => setModal(false)} className="inline-flex items-center h-[30px] pl-4 pr-4 rounded-r-full">Histórico</Button>
                    </div>
                    <div className="inline-flex justify-center items-center rounded-full pl-3 pr-3">
                        <input className="focus:outline-none focus:ring-0" type="text" placeholder="Buscar..." name="" id="" />
                        <img className="w-5 h-5 opacity-25" src="./lupa.png" alt="" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {modal ? (
                        <>
                            <CardKanban setState={setState} estado="Creados" ordenes={creados} />
                            <CardKanban setState={setState} estado="Pendientes" ordenes={pendientes} />
                            <CardKanban setState={setState} estado="Preparados" ordenes={preparados} />
                            <CardKanban setState={setState} estado="En Camino" ordenes={enCamino} />
                        </>
                    ): (
                        <>
                            <CardKanban setState={setState} estado="Entregados" ordenes={entregados} />
                            <CardKanban setState={setState} estado="Cancelados" ordenes={cancelados} />
                        </>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default Summary;

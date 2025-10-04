import CardKanban from "@/app/components/cardKanban";
import { Button } from "@heroui/react";
import { useState } from "react";
import Image from "next/image";
import { IOrder } from "../../../types/orders.type";

interface SummaryProps {
    cambiarOrden?: (nuevaOrden: IOrder) => void;
    creados: IOrder[];
    pendientes: IOrder[];
    preparados: IOrder[];
    enCamino: IOrder[];
    entregados: IOrder[];
    cancelados: IOrder[];
    search: string;
    setSearch: (search: string) => void;
    page: number;
    setPage: (page: number) => void;
    onOrderStateChange?: () => void;
}

const Summary = ({cambiarOrden, creados, pendientes, preparados, enCamino, entregados, cancelados, search, setSearch, page, setPage, onOrderStateChange}: SummaryProps) => {

    const [modal, setModal] = useState(true);

    return (
        <div className="flex flex-col h-full">
            <h1 className="font-poppins font-black text-4xl text-primary">RESUMEN</h1>
            <div className="flex flex-col gap-4">
                <div className="flex justify-between mt-4">
                    <div className="inline-flex text-sm ">
                        <Button onPress={ () => setModal(true)} className="inline-flex items-center h-[30px] bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-l-full">En curso</Button>
                        <Button onPress={ () => setModal(false)} className="inline-flex items-center h-[30px] pl-4 pr-4 rounded-r-full">Histórico</Button>
                    </div>
                    <div className="inline-flex justify-center items-center rounded-full pl-3 pr-3">
                        <input
                            className="focus:outline-none focus:ring-0"
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Image className="w-5 h-5 opacity-25" src="/lupa.png" alt="" width={20} height={20} />
                    </div>
                    <div className="inline-flex text-sm ml-4">
                        <Button onPress={() => setPage(Math.max(1, page - 1))} className="h-[30px] px-3 rounded-l-full">Prev</Button>
                        <span className="h-[30px] px-3 flex items-center bg-gray-200">{page}</span>
                        <Button onPress={() => setPage(page + 1)} className="h-[30px] px-3 rounded-r-full">Next</Button>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    {modal ? (
                        <>
                            <CardKanban cambiarOrden={cambiarOrden} estado="Creados" ordenes={creados} onOrderStateChange={onOrderStateChange} />
                            <CardKanban cambiarOrden={cambiarOrden} estado="Pendientes" ordenes={pendientes} onOrderStateChange={onOrderStateChange} />
                            <CardKanban cambiarOrden={cambiarOrden} estado="Preparados" ordenes={preparados} onOrderStateChange={onOrderStateChange} />
                            <CardKanban cambiarOrden={cambiarOrden} estado="En Camino" ordenes={enCamino} onOrderStateChange={onOrderStateChange} />
                        </>
                    ): (
                        <>
                            <CardKanban cambiarOrden={cambiarOrden} estado="Entregados" ordenes={entregados} onOrderStateChange={onOrderStateChange} />
                            <CardKanban cambiarOrden={cambiarOrden} estado="Cancelados" ordenes={cancelados} onOrderStateChange={onOrderStateChange} />
                        </>
                    )}
                    
                </div>
            </div>
        </div>
    )
}

export default Summary;

import CardKanban from "@/app/components/cardKanban";
import { Dispatch, SetStateAction } from "react";
import Order from "@/entities/order";



interface SummaryProps {
    setOrdenActiva?: Dispatch<SetStateAction<Order | null>>; 
    creados: Order[];
    pendientes: Order[];
    preparados: Order[];
    enCamino: Order[];
}


const Summary = ({setOrdenActiva, creados, pendientes, preparados, enCamino}: SummaryProps) => {
    return (
        <div className="flex flex-col h-full">
            {/*  ~~~ Header ~~~*/}
            <h1 className="font-poppins font-black text-4xl text-primary">RESUMEN</h1>

            {/*  ~~~ Main ~~~*/}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between mt-4">
                    <div className="inline-flex text-sm">
                        <span className="inline-flex items-center bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-l-full">En curso</span>
                        <span className="inline-flex items-center pl-4 pr-4 rounded-r-full">Histórico</span>
                    </div>
                    <div className="inline-flex justify-center items-center rounded-full pl-3 pr-3">
                        <input className="" type="text" placeholder="Buscar..." name="" id="" />
                        <img className="w-5 h-5 opacity-25" src="./lupa.png" alt="" />
                    </div>
                </div>

                

                {/* ~~~ Kanban ~~~ */}
                <div className="flex flex-col gap-2">
                    <CardKanban setOrdenActiva={setOrdenActiva} estado="Creados" ordenes={creados} />
                    <CardKanban setOrdenActiva={setOrdenActiva} estado="Pendientes" ordenes={pendientes} />
                    <CardKanban setOrdenActiva={setOrdenActiva} estado="Preparados" ordenes={preparados} />
                    <CardKanban setOrdenActiva={setOrdenActiva} estado="En Camino" ordenes={enCamino} />
                </div>
            </div>
        </div>
    )
}

export default Summary;

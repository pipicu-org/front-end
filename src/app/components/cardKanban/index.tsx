"use client";

import OrderCard from "../OrderCard";
import { useDrop } from "react-dnd";
import { updateOrderState } from "../../services/order.service";
import { useToast } from "@/utils/toast";
import { IOrder } from "../../types/orders.type";

interface CardKanbanProps {
    estado: string,
    ordenes: IOrder[];
    cambiarOrden?: (nuevaOrden: IOrder) => void;
    onOrderStateChange?: () => void; // Para re-fetch
}

const stateMapping: { [key: string]: number } = {
    "Creados": 1,
    "Pendientes": 2,
    "Preparados": 3,
    "En Camino": 4,
    "Entregados": 5,
    "Cancelados": 6,
};

const CardKanban = ( {cambiarOrden, estado, ordenes = [], onOrderStateChange} : CardKanbanProps) => {
    const { showToast } = useToast();

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'order',
        drop: async (item: { id: number; currentState: string }) => {
            const targetStateId = stateMapping[estado];
            if (item.currentState !== estado) {
                try {
                    await updateOrderState(item.id, targetStateId);
                    showToast(`Orden ${item.id} movida a ${estado}`, "success");
                    onOrderStateChange?.(); // Re-fetch
                } catch (error) {
                    showToast("Error al cambiar estado de la orden", "error");
                    console.error(error);
                }
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));
    return (
        // @ts-expect-error React DnD ref type issue
        <div ref={drop} className={`rounded-xl p-3 bg-[#290D1B0D] ${isOver ? 'bg-[#290D1B1D]' : ''}`}>
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
            <div className="mt-1 flex gap-5  overflow-hidden rounded-xl">
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

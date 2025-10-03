"use client";
import { Button } from "@heroui/react";
import { ReactNode, useEffect, useState } from "react";

import { searchClients } from "@/app/services/clients.service";

import OrdenDefault from "../ordenDefault";
import OrdenVer from "../ordenVer";
import OrdenForm from "../ordenForm";
import { IClient } from "@/app/types/clients.type";

interface OrderModalProps {
    orden: IOrder | null;
    estado: ORDER_UI_STATE;
    setEstado: (nuevoEstado: ORDER_UI_STATE) => void;
    onSave?: (order: IOrder) => void;
}

const OrderModal = ({ orden, estado, setEstado, onSave }: OrderModalProps) => {
    const componentes: Record<ORDER_UI_STATE, ReactNode> = {
        default: <OrdenDefault />,
        ver: <OrdenVer orden={orden} estado={estado} />,
        editar: <OrdenForm orden={orden} isEdit={true} onSave={onSave} onClose={() => setEstado('default')} />,
        nueva: <OrdenForm orden={null} isEdit={false} onSave={onSave} onClose={() => setEstado('default')} />,
    };

    const [clients, setClients] = useState<IClient[]>([]);

    useEffect(() => {
        searchClients('', 1).then(clientsResponse => {
            setClients(clientsResponse.data)
        }).catch(console.error);
    }, []);

    return (
        <div className="flex flex-col h-full">
            <div>
                <h1 className="font-poppins font-black text-4xl text-primary ">ORDEN</h1>
            </div>
            <div className="flex flex-col h-full">
                <div className="flex mt-4">
                    <div className="inline-flex  text-sm ml-auto">
                        <Button onPress={() => setEstado("nueva")} className="inline-flex items-center h-[30px] bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-full">+ Nuevo</Button>
                    </div>
                </div>
                <div
                    style={{ background: `linear-gradient(135deg,rgba(41, 13, 27, 0.32) 0%,rgba(41, 13, 27, 0.32) 66%,rgba(41, 13, 27, 0.32) 100%)` }}
                    className="flex flex-col flex-1 w-full mt-5 rounded-2xl opacity-80">

                    {componentes[estado]}
                </div>
            </div>
        </div>
    )
}

export default OrderModal;

import CardKanban from "@/app/components/cardKanban";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useState } from "react";
import Image from "next/image";
import { IOrder } from "../../../types/orders.type";
import { updateOrderState } from "../../../services/order.service";
import { useToast } from "../../../../utils/toast";

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
    isMobile?: boolean;
}

const Summary = ({cambiarOrden, creados, pendientes, preparados, enCamino, entregados, cancelados, search, setSearch, page, setPage, onOrderStateChange, isMobile}: SummaryProps) => {

    const [modal, setModal] = useState(true);
    const { showToast } = useToast();

    // Función para filtrar órdenes por búsqueda
    const filterOrders = (orders: IOrder[]) => {
        if (!search.trim()) return orders;
        const searchLower = search.toLowerCase();
        return orders.filter(order =>
            order.id.toLowerCase().includes(searchLower) ||
            order.name.toLowerCase().includes(searchLower)
        );
    };

    const stateMapping: { [key: string]: number } = {
        "Creados": 1,
        "Pendientes": 2,
        "Preparados": 3,
        "En Camino": 4,
        "Entregados": 5,
        "Cancelados": 6,
    };

    const changeOrderState = async (orderId: string, newState: string) => {
        const stateId = stateMapping[newState];
        try {
            await updateOrderState(Number(orderId), stateId);
            showToast(`Orden ${orderId} movida a ${newState}`, "success");
            onOrderStateChange?.();
        } catch (error) {
            showToast("Error al cambiar estado de la orden", "error");
            console.error(error);
        }
    };

    if (isMobile) {
        const allOrders = [...creados, ...pendientes, ...preparados, ...enCamino, ...entregados, ...cancelados];
        const filteredOrders = filterOrders(allOrders);
        return (
            <div className="flex flex-col h-full">
                <h1 className="font-poppins font-black text-4xl text-primary">ÓRDENES</h1>
                <div className="flex flex-col gap-4 mt-4 flex-1">
                    <div className="flex justify-between items-center">
                        <input
                            className="flex-1 focus:outline-none focus:ring-0 rounded-full pl-3 pr-3 bg-gray-100"
                            type="text"
                            placeholder="Buscar..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="flex ml-2">
                            <Button onPress={() => setPage(Math.max(1, page - 1))} size="sm" className="rounded-l-full">Prev</Button>
                            <span className="px-3 flex items-center bg-gray-200">{page}</span>
                            <Button onPress={() => setPage(page + 1)} size="sm" className="rounded-r-full">Next</Button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto flex flex-col gap-2">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="p-4 bg-white rounded-lg shadow flex justify-between items-center">
                                <div className="cursor-pointer flex-1" onClick={() => cambiarOrden?.(order)}>
                                    <p className="font-semibold">Orden #{order.id}</p>
                                    <p className="text-sm text-gray-600">Cliente: {order.client}</p>
                                    <p className="text-sm text-gray-600">Estado: {order.state}</p>
                                </div>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button size="sm" variant="light" isIconOnly>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                            </svg>
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu>
                                        <DropdownItem key="creados" onPress={() => changeOrderState(order.id, "Creados")}>Creados</DropdownItem>
                                        <DropdownItem key="pendientes" onPress={() => changeOrderState(order.id, "Pendientes")}>Pendientes</DropdownItem>
                                        <DropdownItem key="preparados" onPress={() => changeOrderState(order.id, "Preparados")}>Preparados</DropdownItem>
                                        <DropdownItem key="en-camino" onPress={() => changeOrderState(order.id, "En Camino")}>En Camino</DropdownItem>
                                        <DropdownItem key="entregados" onPress={() => changeOrderState(order.id, "Entregados")}>Entregados</DropdownItem>
                                        <DropdownItem key="cancelados" onPress={() => changeOrderState(order.id, "Cancelados")}>Cancelados</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="flex flex-col h-full">
                <h1 className="font-poppins font-black text-4xl text-primary">RESUMEN</h1>
                <div className="flex flex-col gap-4 flex-1 overflow-hidden">
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
                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                        {modal ? (
                            <>
                                <CardKanban cambiarOrden={cambiarOrden} estado="Creados" ordenes={filterOrders(creados)} onOrderStateChange={onOrderStateChange} />
                                <CardKanban cambiarOrden={cambiarOrden} estado="Pendientes" ordenes={filterOrders(pendientes)} onOrderStateChange={onOrderStateChange} />
                                <CardKanban cambiarOrden={cambiarOrden} estado="Preparados" ordenes={filterOrders(preparados)} onOrderStateChange={onOrderStateChange} />
                                <CardKanban cambiarOrden={cambiarOrden} estado="En Camino" ordenes={filterOrders(enCamino)} onOrderStateChange={onOrderStateChange} />
                            </>
                        ): (
                            <>
                                <CardKanban cambiarOrden={cambiarOrden} estado="Entregados" ordenes={filterOrders(entregados)} onOrderStateChange={onOrderStateChange} />
                                <CardKanban cambiarOrden={cambiarOrden} estado="Cancelados" ordenes={filterOrders(cancelados)} onOrderStateChange={onOrderStateChange} />
                            </>
                        )}

                    </div>
                </div>
            </div>
        );
    }
}

export default Summary;

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@heroui/react";

// Componentes de Recepcion
import Summary from "./components/summary/Summary";
import OrdenModal from "./components/orden/ordenModal";

import { getOrdersByStateID } from "../services/order.service";
import { IOrder, ORDER_UI_STATE } from "../types/orders.type";

const Reception = () => {

    // Estados para órdenes por estado
    const [ordenes_creados, setOrdenesCreados] = useState<IOrder[]>([]);
    const [ordenes_pendientes, setOrdenesPendientes] = useState<IOrder[]>([]);
    const [ordenes_preparados, setOrdenesPreparados] = useState<IOrder[]>([]);
    const [ordenes_enCamino, setOrdenesEnCamino] = useState<IOrder[]>([]);
    const [ordenes_entregados, setOrdenesEntregados] = useState<IOrder[]>([]);
    const [ordenes_cancelados, setOrdenesCancelados] = useState<IOrder[]>([]);

    // Estados para búsqueda y paginación
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);

    // Función para cargar órdenes por estado
    const loadOrdersByState = useCallback(async (stateId: string, setter: (orders: IOrder[]) => void) => {
        try {
            const response = await getOrdersByStateID(stateId, search, page, limit);
            setter(response.data);
        } catch (error) {
            console.error(`Error loading orders for state ${stateId}:`, error);
        }
    }, [search, page, limit]);

    // Función para re-fetch todas las órdenes
    const reloadAllOrders = useCallback(() => {
        loadOrdersByState("1", setOrdenesCreados);
        loadOrdersByState("2", setOrdenesPendientes);
        loadOrdersByState("3", setOrdenesPreparados);
        loadOrdersByState("4", setOrdenesEnCamino);
        loadOrdersByState("5", setOrdenesEntregados);
        loadOrdersByState("6", setOrdenesCancelados);
    }, [loadOrdersByState]);

    useEffect(() => {
        // Cargar órdenes para todos los estados cuando cambie search o page
        loadOrdersByState("1", setOrdenesCreados); // Creados
        loadOrdersByState("2", setOrdenesPendientes); // Pendientes
        loadOrdersByState("3", setOrdenesPreparados); // Preparados
        loadOrdersByState("4", setOrdenesEnCamino); // En camino
        loadOrdersByState("5", setOrdenesEntregados); // Entregado
        loadOrdersByState("6", setOrdenesCancelados); // Cancelado
    }, [loadOrdersByState]);

    const [ordenActiva, setOrdenActiva] = useState<IOrder | null>(null);
    const [estadoOrden, setEstadoOrden] = useState<ORDER_UI_STATE>("default");
    const [isMobile, setIsMobile] = useState(false);
    const [saveOrderCallback, setSaveOrderCallback] = useState<(() => void) | null>(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const puedeCambiarEstado = (): boolean => {
        return true;
    };


    const cambiarEstado = (nuevoEstado: ORDER_UI_STATE) => {
        if (puedeCambiarEstado()) setEstadoOrden(nuevoEstado);
    };

    const cambiarOrden = (nuevaOrden: IOrder) => {
        if (ordenActiva == null) {
            setOrdenActiva(nuevaOrden);
            cambiarEstado("ver");
        } else {
            if (puedeCambiarEstado()) {
                setOrdenActiva(nuevaOrden);
                cambiarEstado("ver");
            }
        }
    };



    if (isMobile) {
        return (
            <div className="min-h-screen relative">
                {ordenActiva || estadoOrden === 'nueva' ? (
                    <OrdenModal
                        orden={ordenActiva}
                        estado={estadoOrden}
                        setEstado={cambiarEstado}
                        setSaveOrderCallback={setSaveOrderCallback}
                        isMobile={isMobile}
                        onSave={(savedOrder) => {
                            setOrdenActiva(savedOrder);
                            cambiarEstado("ver");
                            reloadAllOrders();
                        }}
                    />
                ) : (
                    <Summary
                        cambiarOrden={cambiarOrden}
                        creados={ordenes_creados}
                        pendientes={ordenes_pendientes}
                        preparados={ordenes_preparados}
                        enCamino={ordenes_enCamino}
                        entregados={ordenes_entregados}
                        cancelados={ordenes_cancelados}
                        search={search}
                        setSearch={setSearch}
                        page={page}
                        setPage={setPage}
                        onOrderStateChange={reloadAllOrders}
                        isMobile={isMobile}
                    />
                )}
                <div className="fixed bottom-4 right-4">
                    <Button
                        isIconOnly
                        color="primary"
                        size="lg"
                        onPress={() => {
                            if (estadoOrden === 'nueva' && saveOrderCallback) {
                                saveOrderCallback();
                            } else {
                                setOrdenActiva(null);
                                cambiarEstado("nueva");
                            }
                        }}
                        className="rounded-full shadow-lg"
                    >
                        {estadoOrden === 'nueva' ? '✓' : '+'}
                    </Button>
                </div>
            </div>
        );
    } else {
        return (
            // <div className="grid grid-cols-7 gap-6 border">
            <div className="grid grid-cols-7 gap-6 border items-stretch">
                <div className="col-span-4">
                    <Summary
                        cambiarOrden={cambiarOrden}
                        creados={ordenes_creados}
                        pendientes={ordenes_pendientes}
                        preparados={ordenes_preparados}
                        enCamino={ordenes_enCamino}
                        entregados={ordenes_entregados}
                        cancelados={ordenes_cancelados}
                        search={search}
                        setSearch={setSearch}
                        page={page}
                        setPage={setPage}
                        onOrderStateChange={reloadAllOrders}
                        isMobile={isMobile}
                    />
                </div>
                {/* <div className="col-span-3 flex flex-col"> */}
                 <div className="col-span-3 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-auto">
                        <OrdenModal
                            orden={ordenActiva}
                            estado={estadoOrden}
                            setEstado={cambiarEstado}
                            onSave={(savedOrder) => {
                                setOrdenActiva(savedOrder);
                                cambiarEstado("ver");
                                reloadAllOrders();
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Reception;

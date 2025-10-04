"use client";

import { useState, useEffect, useCallback } from "react";

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

    const puedeCambiarEstado = (nuevoEstado: ORDER_UI_STATE): boolean => {
        // if (estadoOrden === "nueva" && (nuevoEstado === "ver" || nuevoEstado === "default")) {
        //     return window.confirm("Hay cambios sin guardar");
        // }

        // if (estadoOrden === "editar" && (nuevoEstado === "ver" || nuevoEstado === "nueva")) {
        //     return window.confirm("Hay cambios sin guardar");
        // }

        return true;
    };


    const cambiarEstado = (nuevoEstado: ORDER_UI_STATE) => {
        if (puedeCambiarEstado(nuevoEstado)) setEstadoOrden(nuevoEstado);
    };

    const cambiarOrden = (nuevaOrden: IOrder) => {
        if (ordenActiva == null) {
            setOrdenActiva(nuevaOrden);
            cambiarEstado("ver");
        } else {
            if (puedeCambiarEstado("ver")) {
                setOrdenActiva(nuevaOrden);
                cambiarEstado("ver");
            }
        }
    };
    // const cambiarEstado = (nuevoEstado: estadosDeOrden) => {
    //     if (estadoOrden == "nueva" && (nuevoEstado == "ver" || nuevoEstado == "default")) {
    //         const confirmar = window.confirm("Hay cambios sin guardar");
    //         // retorna false tanto para la funcion cambiarOrden como tambien para cortar la ejecucion y evitar los proximos condicionales
    //         if (!confirmar) return false;
    //     }

    //     if (estadoOrden == "editar" && (nuevoEstado == "ver" || nuevoEstado == "nueva")) {
    //         const confirmar = window.confirm("Hay cambios sin guardar");
    //         if (!confirmar) return false;
    //     }
    //     setEstadoOrden(nuevoEstado);
    //     return true;
    // }

    // const cambiarOrden = (nuevaOrden: IOrder) => {
    //     // No uso useEffect porque no me detecta cuando cambia a la misma orden y eso provoca que "cambiarEstado" no se active. 
    //     if (ordenActiva == null) {
    //         setOrdenActiva(nuevaOrden);
    //         cambiarEstado("ver");
    //     } else {
    //         let permitido = cambiarEstado("ver");
    //         console.log("Hola");
    //         if (permitido) setOrdenActiva(nuevaOrden);
    //     }
    // }


    return (
        <div className="grid grid-cols-7 gap-6 h-full">
            <div className="col-span-4 h-full">
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
                />
            </div>
            <div className="col-span-3 flex flex-col">
                <OrdenModal
                    orden={ordenActiva}
                    estado={estadoOrden}
                    setEstado={cambiarEstado}
                    onSave={(savedOrder) => {
                        setOrdenActiva(savedOrder);
                        cambiarEstado("ver");
                    }}
                />
            </div>
        </div>
    );
}

export default Reception;

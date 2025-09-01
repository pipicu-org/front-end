"use client";

import { useState, useEffect } from "react";

// Componentes de Recepcion
import Summary from "./components/summary/Summary";
import OrdenModal from "./components/orden/ordenModal";

const Reception = () => {

    const ordenes_creados: IOrder[] = [];
    const ordenes_pendientes: IOrder[] = [];
    const ordenes_preparados: IOrder[] = [];
    const ordenes_enCamino: IOrder[] = [];
    const ordenes_entregados: IOrder[] = [];
    const ordenes_cancelados: IOrder[] = [];

    const [ordenActiva, setOrdenActiva] = useState<IOrder | null>(null);
    const [estadoOrden, setEstadoOrden] = useState<ORDER_UI_STATE>("default");

    const puedeCambiarEstado = (nuevoEstado: ORDER_UI_STATE): boolean => {
        if (estadoOrden === "nueva" && (nuevoEstado === "ver" || nuevoEstado === "default")) {
            return window.confirm("Hay cambios sin guardar");
        }

        if (estadoOrden === "editar" && (nuevoEstado === "ver" || nuevoEstado === "nueva")) {
            return window.confirm("Hay cambios sin guardar");
        }

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
                />
            </div>
            <div className="col-span-3 flex flex-col">
                <OrdenModal orden={ordenActiva} estado={estadoOrden} setEstado={cambiarEstado} />
            </div>
        </div>
    );
}

export default Reception;

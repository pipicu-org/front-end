"use client";

import { useState, useEffect } from "react";

// Componentes de Recepcion
import Summary from "./components/summary/Summary";
import { OrdenModal } from "./components/orden";

// Interfaz
import Order from "@/entities/order";
import ordenesAleatorias from "../components/OrdenesAleatorias";


const Reception = () => {
    const [info, setInfo] = useState([]);

    const getData = async () => {
        try {

            const response = await fetch("/api/client?search=&page=1");
            if (!response.ok) throw new Error("HTTP error " + response.status);

            const data = await response.json();
            console.log("Datos crudos:", data);
            setInfo(data);
        } catch (err) {
            console.error("Error al traer los datos:", err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const ordenes_creados: Order[] = [];
    const ordenes_pendientes: Order[] = [];
    const ordenes_preparados: Order[] = [];
    const ordenes_enCamino: Order[] = [];
    const ordenes_entregados: Order[] = [];
    const ordenes_cancelados: Order[] = [];

    // ordenesAleatorias.map((orden) => {
    //     if (orden.state == "Creados") {
    //         ordenes_creados.push(orden)
    //     } else if (orden.state == "Pendientes") {
    //         ordenes_pendientes.push(orden)
    //     } else if (orden.state == "Preparados") {
    //         ordenes_preparados.push(orden)
    //     } else if (orden.state == "En camino") {
    //         ordenes_enCamino.push(orden)
    //     } else if (orden.state == "Cancelado") {
    //         ordenes_cancelados.push(orden)
    //     } else if (orden.state == "Entregado") {
    //         ordenes_entregados.push(orden)
    //     }
    // });

    const [ordenActiva, setOrdenActiva] = useState<Order | null>(null);

    type estadosDeOrden = "default" | "ver" | "editar" | "nueva";
    const [estadoOrden, setEstadoOrden] = useState<estadosDeOrden>("default");

    const cambiarEstado = (nuevoEstado: estadosDeOrden) => {
        if (estadoOrden == "nueva" && (nuevoEstado == "ver" || nuevoEstado == "default")) {
            const confirmar = window.confirm("Hay cambios sin guardar");
            // retorna false tanto para la funcion cambiarOrden como tambien para cortar la ejecucion y evitar los proximos condicionales
            if (!confirmar) return false;
        }

        if (estadoOrden == "editar" && (nuevoEstado == "ver" || nuevoEstado == "nueva")) {
            const confirmar = window.confirm("Hay cambios sin guardar");
            if (!confirmar) return false;
        }
        setEstadoOrden(nuevoEstado);
        return true;
    }

    const cambiarOrden = (nuevaOrden: Order) => {
        // No uso useEffect porque no me detecta cuando cambia a la misma orden y eso provoca que "cambiarEstado" no se active. 
        if (ordenActiva == null) {
            setOrdenActiva(nuevaOrden);
            cambiarEstado("ver");
        } else {
            let permitido = cambiarEstado("ver");
            console.log("Hola");
            if (permitido) setOrdenActiva(nuevaOrden);
        }
    }

    // useEffect(() => {
    //     if(ordenActiva){
    //         cambiarEstado("ver");
    //     }
    // }, [ordenActiva]); 

    //  return <pre>{JSON.stringify(info, null, 2)}</pre>;

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

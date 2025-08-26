"use client";

import { useState, useEffect } from "react";

// Componentes de Recepcion
import Summary from "./components/summary/Summary";
import Orden from "./components/orden";

// Interfaz
import Order from "@/entities/order";
import ordenesAleatorias from "../components/OrdenesAleatorias";

const Reception = () => {

    const ordenes_creados:Order[] = [];
    const ordenes_pendientes:Order[] = [];
    const ordenes_preparados:Order[] = [];
    const ordenes_enCamino:Order[] = [];

    ordenesAleatorias.map( (orden) => {
        if (orden.state == "Creados"){
            ordenes_creados.push(orden)
        } else if (orden.state == "Pendientes"){
            ordenes_pendientes.push(orden)
        } else if (orden.state == "Preparados"){
            ordenes_preparados.push(orden)
        } else if (orden.state == "En camino"){
            ordenes_enCamino.push(orden)
        }
    });  
    
    const [ordenActiva, setOrdenActiva] = useState<Order | null>(null);

    // useEffect(() => {
    //     if (ordenActiva) {
    //     console.log("Nueva orden activa:", ordenActiva);
    //     } else {
    //     console.log("No hay orden activa seleccionada");
    //     }
    // }, [ordenActiva]); 

    return (
        <div className="grid grid-cols-7 gap-6 h-full">
            <div className="col-span-4 h-full">
                <Summary
                    setOrdenActiva={setOrdenActiva} 
                    creados={ordenes_creados}
                    pendientes={ordenes_pendientes}
                    preparados={ordenes_preparados}
                    enCamino={ordenes_enCamino}
                />
            </div>
            <div className="col-span-3 flex flex-col">
                <Orden orden={ordenActiva} />
            </div>
        </div>
    );
}

export default Reception;

"use client";
import { useState } from "react";

// Componentes de Recepcion
import Summary from "./components/summary/Summary";
import { OrderModal } from "./components/orden";

// Interfaz
// import Order from "@/entities/order";
// import ordenesAleatorias from "../components/OrdenesAleatorias";

const Reception = () => {
    const ordenes_creados: IOrder[] = [];
    const ordenes_pendientes: IOrder[] = [];
    const ordenes_preparados: IOrder[] = [];
    const ordenes_enCamino: IOrder[] = [];
    const ordenes_entregados: IOrder[] = [];
    const ordenes_cancelados: IOrder[] = [];

    // const [info, setInfo] = useState([]);

    // const getData = async () => {
    //     try {

    //         const response = await fetch("/api/client?search=&page=1");
    //         if (!response.ok) throw new Error("HTTP error " + response.status);

    //         const data = await response.json();
    //         console.log("Datos crudos:", data);
    //         setInfo(data);
    //     } catch (err) {
    //         console.error("Error al traer los datos:", err);
    //     }
    // };

    // useEffect(() => {
    //     getData();
    // }, []);

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

    // useEffect(() => {
    //     if(ordenActiva){
    //         cambiarEstado("ver");
    //     }
    // }, [ordenActiva]); 

    //  return <pre>{JSON.stringify(info, null, 2)}</pre>;

    const [ordenActiva, setOrdenActiva] = useState<IOrder | null>(null);
    const [estadoOrden, setEstadoOrden] = useState<ORDER_UI_STATE>("default");

    const cambiarEstado = (nuevoEstado: ORDER_UI_STATE) => {
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

    const cambiarOrden = (nuevaOrden: IOrder) => {
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
                <OrderModal orden={ordenActiva} estado={estadoOrden} setEstado={cambiarEstado} />
            </div>
        </div>
    );
}

export default Reception;

"use client";

import { useState, useEffect } from "react";

// Componentes de HeroUI
import { Button, Input } from "@heroui/react";
// Componentes de App
import CardKanban from "../components/cardKanban";
// Componentes de Recepcion
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

    console.log(ordenes_creados);
    


    const [ordenActiva, setOrdenActiva] = useState<Order | null>(null);


    useEffect(() => {
    if (ordenActiva) {
      console.log("Nueva orden activa:", ordenActiva);
    } else {
      console.log("No hay orden activa seleccionada");
    }
  }, [ordenActiva]); 


    return (
        <div className="grid grid-cols-7 items-stretch gap-7">
            {/* ~~~ RESUMEN ~~~ */}
            <div className="col-span-4">
                <div className="flex flex-col ">
                    {/*  ~~~ Header ~~~*/}
                    <div>
                        <h1 className="font-poppins font-black text-4xl text-primary mt-3">RESUMEN</h1>
                    </div>

                    {/*  ~~~ Main ~~~*/}
                    <div className="flex flex-col">
                        <div className="flex justify-between mt-4">
                            <div className="inline-flex  text-sm">
                                <span className="inline-flex items-center bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-l-full">En curso</span>
                                <span className="inline-flex items-center pl-4 pr-4 rounded-r-full">Histórico</span>
                            </div>
                            <div className="inline-flex justify-center items-center rounded-full pl-3 pr-3">
                                <input className="" type="text" placeholder="Buscar..." name="" id="" />
                                <img className="w-5 h-5 opacity-25" src="./lupa.png" alt="" />
                            </div>

                        </div>

                        {/* ~~~ Kanban ~~~ */}

                        <div className="flex flex-col">
                            <CardKanban setOrdenActiva={setOrdenActiva} estado="Creados" ordenes={ordenes_creados} />
                            <CardKanban setOrdenActiva={setOrdenActiva} estado="Pendientes" ordenes={ordenes_pendientes} />
                            <CardKanban setOrdenActiva={setOrdenActiva} estado="Preparados" ordenes={ordenes_preparados} />
                            <CardKanban setOrdenActiva={setOrdenActiva} estado="En Camino" ordenes={ordenes_enCamino} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ~~~ ORDEN ~~~ */}
            <div className="col-span-3 flex flex-col">
                <Orden orden={ordenActiva} />
            </div>

        </div>

    );
}




// const Reception = () => {
//     return (
//         <div className="flex bg-red-600 h-full">
//             <div className="grid grid-cols-6 gap-7 w-full h-full ">
//                 <div className="col-start-1 col-end-5 ">

//                     {/*  ~~~ Header ~~~*/}
//                     <div>
//                         <h1 className="font-poppins font-black text-4xl text-primary">RESUMEN</h1>
//                     </div>

//                     {/*  ~~~ Main ~~~*/}
//                     <div className="flex flex-col">
//                         <div className="flex justify-between mt-4">
//                             <div className="inline-flex  text-sm">
//                                 <span className="inline-flex items-center bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-l-full">En curso</span>
//                                 <span className="inline-flex items-center pl-4 pr-4 rounded-r-full">Histórico</span>
//                             </div>
//                             <div className="inline-flex justify-center items-center rounded-full pl-3 pr-3">
//                                 <input className="" type="text" placeholder="Buscar..." name="" id="" />
//                                 <img className="w-5 h-5 opacity-25" src="./lupa.png" alt="" />
//                             </div>

//                         </div>

//                         {/* ~~~ Kanban ~~~ */}

//                         <div className="flex flex-col">
//                             <CardKanban></CardKanban>
//                             <CardKanban></CardKanban>
//                             <CardKanban></CardKanban>
//                             <CardKanban></CardKanban>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="col-start-5 col-end-8 bg-blue-100"></div>
//             </div>       
//         </div>
//     )
// }





export default Reception;

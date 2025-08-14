"use client";
import { Button, Input } from "@heroui/react";
import OrderStateColumn from "./components/orderStateColumn";
import CardKanban from "./components/cardKanban";



/*
F0E6D1

18 FAF5F1 0
65 E7DADC 100
72 DBC7CA 100

*/

const Reception = () => {
    return (
 
        <>
        <div className="grid grid-cols-6 gap-7 w-full  mt-10">
            <div className="col-start-1 col-end-5 ">

                {/*  ~~~ Header ~~~*/}
                <div>
                    <h1 className="font-poppins font-black text-4xl">Resumen</h1>
                </div>


                {/*  ~~~ Main ~~~*/}
                <div>
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

                    <CardKanban></CardKanban>
                    <CardKanban></CardKanban>
                    <CardKanban></CardKanban>
                    <CardKanban></CardKanban>
                </div>
            </div>
            <div className="col-start-5 col-end-8 bg-blue-100"></div>
        </div>       
        </>

    )
}



// const Reception = () => {
//     return (
//         <>
//             <div className="flex justify-between sm:flex-row gap-[16px] w-full">
//                 <div className="flex items-center sm:flex-row gap-[16px] w-full sm:w-auto">
//                     <Button
//                         variant="solid"
//                         color="primary"
//                         className="w-full sm:w-auto"
//                     >
//                         Nueva orden
//                     </Button>
//                     <Button
//                         variant="solid"
//                         color="primary"
//                         className="w-full sm:w-auto"
//                     >
//                         Historico
//                     </Button>
//                 </div>
//                 <div>
//                     <Input label="Buscar" type="text" />
//                 </div>
//             </div>
//             <div className="flex gap-[16px] w-full overflow-x-auto">
//                 <OrderStateColumn
//                     state="Creados"
//                     orders={[{ id: '1', name: "esteban", estimatedTime: "10:00", state: "Creados" }]}
//                 />
//                 <OrderStateColumn
//                     state="Pendientes"
//                     orders={[{ id: '2', name: "esteban", estimatedTime: "10:00", state: "Pendientes" }]}
//                 />
//                 <OrderStateColumn
//                     state="Preparados"
//                     orders={[{ id: '3', name: "esteban", estimatedTime: "10:00", state: "Preparados" }]}
//                 />
//                 <OrderStateColumn
//                     state="En camino"
//                     orders={[{ id: '4', name: "esteban", estimatedTime: "10:00", state: "En camino" }]}
//                 />
//             </div>
//         </>
//     );
// }

export default Reception;

"use client";
import { Button, Input } from "@heroui/react";
import OrderStateColumn from "./components/orderStateColumn";
import CardKanban from "./components/cardKanban";
import { div } from "framer-motion/client";






const Reception = () => {
    return (
        <div className="grid grid-cols-7">
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
                            <CardKanban></CardKanban>
                            <CardKanban></CardKanban>
                            <CardKanban></CardKanban>
                            <CardKanban></CardKanban>
                        </div>
                    </div>
                </div>
            </div>

            {/* ~~~ ORDEN ~~~ */}
            <div className="col-span-3">
            </div>

        </div>

    )
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

import Order from "@/entities/order"
import OrdenButton from "../ordenButton";
import OrdenInput from "../ordenInput";

interface Ordenprops {
    orden?: Order | null;
}

const Orden = ({orden} : Ordenprops) => {    

    const style={
                    background: `linear-gradient(
                      135deg,
                      rgba(161, 161, 161, 0.5) 0%,
                      rgba(161, 161, 161, 0.05) 66%,
                      rgba(161, 161, 161, 0.6) 100%
                    ), #ffffff`
                } 

    if (!orden){
    return (
        <div className="flex flex-col h-full">
            {/* ~~~ HEADER ~~~ */}
            <div>
                <h1 className="font-poppins font-black text-4xl text-primary ">ORDEN</h1>
            </div>
            {/* ~~~ MAIN ~~~ */}
            <div className="flex flex-col h-full">
                <div className="flex mt-4">
                    <div className="inline-flex  text-sm ml-auto">
                        <span className="inline-flex items-center bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-full">+ Nuevo</span>
                    </div>
                </div>

                {/* ~~~ Kanban ~~~ */}
                <div
                    style={{
                        background: `linear-gradient(
                             135deg,
                              rgba(41, 13, 27, 0.32) 0%,  
                              rgba(41, 13, 27, 0.32) 66%,
                              rgba(41, 13, 27, 0.32) 100%)`
                    }}

                    className="flex flex-col flex-1 w-full mt-5 rounded-2xl opacity-80">
                    <div className="flex flex-col items-center justify-center text-center font-poppins text-primary">
                        <span className="text-[150px] font-black opacity-10 w-full text-right pr-10">+</span>
                        <div>
                            <div>
                                <h1 className="text-5xl font-black">20:02</h1>
                                <img src="relog" alt="" />
                            </div>
                            <span className="text-sm font-ligh">Nuevo pedido en 30'</span>
                        </div>
                        <h1 className=" font-black text-[60px] opacity-40 pt-4">+ORDEN</h1>
                    </div>
                </div>
            </div>
        </div>
    )
    } else {
        return (
            <div className="flex flex-col h-full">
            {/* ~~~ HEADER ~~~ */}
            <div>
                <h1 className="font-poppins font-black text-4xl text-primary">ORDEN</h1>
            </div>
            {/* ~~~ MAIN ~~~ */}
            <div className="flex flex-col h-full">
                <div className="flex mt-4">
                    <div className="inline-flex  text-sm ml-auto">
                        <span className="inline-flex items-center bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-full">+ Nuevo</span>
                    </div>
                </div>

                {/* ~~~ Kanban ~~~ */}
                <div
                    style={{
                        background: `linear-gradient(
                             135deg,
                              rgba(41, 13, 27, 0.32) 0%,  
                              rgba(41, 13, 27, 0.32) 66%,
                              rgba(41, 13, 27, 0.32) 100%)`
                    }}

                    className="flex flex-col flex-1 w-full mt-5 rounded-2xl opacity-80">
                        
                    <div className="grid grid-cols-5 gap-3 h-full">
                            <div className="col-span-3 text-primary font-poppins p-4">

                                <div >
                                    <div className="flex flex-col">
                                        <span className="flex text-3xl font-black ">20:30</span>
                                        <img src="relog" alt="" className="flex "/>
                                    </div>
                                    <span className="text-sm">Hora de entrega</span>
                                </div>

                                <div className="pt-5 flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <span className="font-black">¿Quién?</span>
                                        <OrdenInput value={"Juan"} icon={"user-solid-primary"} />
                                    </div>
                                    {/* Metodos de contacto */}
                                    <div className="flex justify-between">
                                        <OrdenButton nombre={"Whatsapp"}  icon={"whatsapp-solid-dark"}/>
                                        <OrdenButton nombre={"Instagram"} icon={"instagram-solid-dark"} />
                                        <OrdenButton nombre={"Facebook"}  icon={"facebook-solid-dark"} />
                                        <OrdenButton nombre={"Otro"}      icon={"share-solid-dark"} />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-3">
                                            <OrdenInput value={"Juan"} icon={"instagram-outline-primary"} />
                                            <OrdenInput value={"Juan"} icon={"phone-outline-primary"} />
                                            
                                        </div>
                                        <OrdenInput value={"Juan"} icon={"www-outline-primary"} />
                                    </div>

                                    {/* Metodo de pago */}
                                    <div className="flex flex-col gap-2">
                                        <span className="font-black">¿Cómo?</span>
                                        <div className="flex justify-between">
                                            <OrdenButton nombre={"Efectivo"}  icon={"efectivo-solid-dark"}/>
                                            <OrdenButton nombre={"Transferencia"} icon={"transference-outline-dark"} />
                                            <OrdenButton nombre={"Débito"}  icon={"creditCard-solid-dark"} />
                                            <OrdenButton nombre={"Otros"}      icon={"payment-outline-dark"} />
                                        </div>
                                    </div>



                                </div>
                            </div>
                            <div className="col-span-2">
                                <span>RESUMEN</span>
                                <div>
                                    {/* Se puede hacer con tablas????er */}
                                </div>
                            </div>
                    </div>

                </div>
            </div>
        </div>
        )
    }
}

export default Orden;

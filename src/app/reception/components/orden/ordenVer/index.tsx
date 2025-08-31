
import IconButton from "@/app/components/iconButton";
import Input from "@/app/components/input";

interface OrdenVerprops {
    orden: IOrder | null;
    estado: ORDER_UI_STATE;
}

const OrdenVer = ({orden, estado} : OrdenVerprops) => {
    return (
            <div className="grid grid-cols-5 gap-3 h-full">
                <div className="col-span-3 text-primary font-poppins p-4">

                    <div >
                        <div className="flex flex-col">
                            <span className="flex text-3xl font-black ">20:30</span>
                            <img src="relog" alt="" className="flex " />
                        </div>
                        <span className="text-sm">Hora de entrega</span>
                    </div>

                    <div className="pt-5 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <span className="font-black">¿Quién?</span>
                            <Input value={"Juan"} icon={"user-solid-primary"} />
                        </div>
                        {/* Metodos de contacto */}
                        <div className="flex justify-between">
                            <IconButton nombre={"Whatsapp"} icon={"whatsapp-solid-dark"} />
                            <IconButton nombre={"Instagram"} icon={"instagram-solid-dark"} />
                            <IconButton nombre={"Facebook"} icon={"facebook-solid-dark"} />
                            <IconButton nombre={"Otro"} icon={"share-solid-dark"} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-3">
                                <Input value={"Juan"} icon={"instagram-outline-primary"} />
                                <Input value={"Juan"} icon={"phone-outline-primary"} />

                            </div>
                            <Input value={"Juan"} icon={"www-outline-primary"} />
                        </div>

                        {/* Metodo de pago */}
                        <div className="flex flex-col gap-2">
                            <span className="font-black">¿Cómo?</span>
                            <div className="flex justify-between">
                                <IconButton nombre={"Efectivo"} icon={"efectivo-solid-dark"} />
                                <IconButton nombre={"Transferencia"} icon={"transference-outline-dark"} />
                                <IconButton nombre={"Débito"} icon={"creditCard-solid-dark"} />
                                <IconButton nombre={"Otros"} icon={"payment-outline-dark"} />
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

    )
}

export default OrdenVer;

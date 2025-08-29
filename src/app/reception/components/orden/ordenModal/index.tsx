import { Button } from "@heroui/react";
import Order from "@/entities/order";
import OrdenDefault from "../ordenDefault";
import OrdenVer from "../ordenVer";
import OrdenForm from "../ordenForm";
import { ReactNode } from "react";

type EstadoOrden = "default" | "ver" | "editar" | "nueva";

interface Ordenprops {
    orden?: Order | null;
    estado: EstadoOrden;
    setEstado: (nuevoEstado: EstadoOrden) => void;

}
const OrdenModal = ({ orden, estado, setEstado }: Ordenprops) => {
    const componentes: Record<EstadoOrden, ReactNode> = {
    default: <OrdenDefault />,
    ver: <OrdenVer orden={orden} estado={estado} />,
    editar: <OrdenForm/>,
    nueva: <OrdenForm />,
  };

    return (

        <div className="flex flex-col h-full">
            <div>
                <h1 className="font-poppins font-black text-4xl text-primary ">ORDEN</h1>
            </div>
            <div className="flex flex-col h-full">
                <div className="flex mt-4">
                    <div className="inline-flex  text-sm ml-auto">
                        <Button onClick={() => setEstado("nueva")} className="inline-flex items-center h-[30px] bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-full">+ Nuevo</Button>
                    </div>
                </div>
                <div
                    style={{ background: `linear-gradient(135deg,rgba(41, 13, 27, 0.32) 0%,rgba(41, 13, 27, 0.32) 66%,rgba(41, 13, 27, 0.32) 100%)` }}
                    className="flex flex-col flex-1 w-full mt-5 rounded-2xl opacity-80">

                     {componentes[estado]}

                </div>
            </div>
        </div>
    )


}


export default OrdenModal;
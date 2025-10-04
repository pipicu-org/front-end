import CardKanban from "@/app/components/cardKanban";
import Image from "next/image";

const TablaDeFuegos = () => {
    return (
        <div className="flex flex-col ">
            {/*  ~~~ Header ~~~*/}
            <div>
                <h1 className="font-poppins font-black text-4xl text-primary mt-3">TABLA DE FUEGOS</h1>
            </div>

            {/*  ~~~ Main ~~~*/}
            <div className="flex flex-col">
                <div className="flex justify-between mt-4">
                    <h1><span>26</span> Productos en la tabla</h1>
                    <div className="inline-flex justify-center items-center rounded-full pl-3 pr-3">
                        <input className="" type="text" placeholder="Buscar..." name="" id="" />
                        <Image className="w-5 h-5 opacity-25" src="/lupa.png" alt="" width={20} height={20} />
                    </div>

                </div>

                {/* ~~~ Kanban ~~~ */}

                <div className="flex flex-col mt-4">
                    <CardKanban estado="Creados" ordenes={[]}></CardKanban>
                    <CardKanban estado="Pendientes" ordenes={[]}></CardKanban>
                    <CardKanban estado="Preparados" ordenes={[]}></CardKanban>
                    <CardKanban estado="En Camino" ordenes={[]}></CardKanban>
                </div>
            </div>
        </div>
    )
}

export default TablaDeFuegos;
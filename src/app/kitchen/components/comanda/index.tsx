import CardKanban from "@/app/components/cardKanban";

const Comanda = () => {
    return (
        <div className="flex flex-col ">
            {/*  ~~~ Header ~~~*/}
            <div>
                <h1 className="font-poppins font-black text-4xl text-primary mt-3">COMANDA</h1>
            </div>

            {/*  ~~~ Main ~~~*/}
            <div className="flex flex-col">
                <div className="flex justify-between mt-4">
                    <h1><span>5</span> Comandas en curso</h1>
                    <div className="inline-flex justify-center items-center rounded-full pl-3 pr-3">
                        <input className="" type="text" placeholder="Buscar..." name="" id="" />
                        <img className="w-5 h-5 opacity-25" src="./lupa.png" alt="" />
                    </div>

                </div>

                {/* ~~~ Kanban ~~~ */}

                <div className="flex flex-col mt-4">
                    <CardKanban estado="Pendientes" ordenes={[]}></CardKanban>
                    <CardKanban estado="Preparados" ordenes={[]}></CardKanban>
                    <CardKanban estado="En camino" ordenes={[]}></CardKanban>
                    <CardKanban estado="Entregado" ordenes={[]}></CardKanban>
                </div>
            </div>
        </div>
    )
}


export default Comanda;
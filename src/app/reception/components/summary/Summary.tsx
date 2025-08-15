import CardKanban from "@/app/components/cardKanban";

const Summary = () => {
    return (
        <div className="flex flex-col h-full">
            {/*  ~~~ Header ~~~*/}
            <h1 className="font-poppins font-black text-4xl text-primary">RESUMEN</h1>

            {/*  ~~~ Main ~~~*/}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between mt-4">
                    <div className="inline-flex text-sm">
                        <span className="inline-flex items-center bg-[#3D3D3D45] text-white pl-4 pr-4 rounded-l-full">En curso</span>
                        <span className="inline-flex items-center pl-4 pr-4 rounded-r-full">Histórico</span>
                    </div>
                    <div className="inline-flex justify-center items-center rounded-full pl-3 pr-3">
                        <input className="" type="text" placeholder="Buscar..." name="" id="" />
                        <img className="w-5 h-5 opacity-25" src="./lupa.png" alt="" />
                    </div>
                </div>

                <div className="flex h-max bg-red-300">
                    das
                </div>

                {/* ~~~ Kanban ~~~ */}
                <div className="hidden flex flex-col gap-2 h-24 overflow-y-scroll">
                    {
                        // Mock filler
                        [1, 2, 3, 4].map((i) =>
                            <CardKanban key={i} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Summary;

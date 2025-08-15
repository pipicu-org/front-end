

const Orden = () => {
    return (
        <div className="flex flex-col h-full">
            {/* ~~~ HEADER ~~~ */}
            <div>
                <h1 className="font-poppins font-black text-4xl text-primary mt-3">ORDEN</h1>
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
}



export default Orden;
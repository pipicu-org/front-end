import CardKanban from "../components/cardKanban";



const Kitchen = () => {
  return (
    <div className="grid grid-cols-7 items-stretch gap-7">
      {/* ~~~ RESUMEN ~~~ */}
      <div className="col-span-4">
        <div className="flex flex-col ">
          {/*  ~~~ Header ~~~*/}
          <div>
            <h1 className="font-poppins font-black text-4xl text-primary mt-3">TABLA DE FUEGOS</h1>
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
      <div className="col-span-3 flex flex-col">
        <div className="flex flex-col ">
          {/*  ~~~ Header ~~~*/}
          <div>
            <h1 className="font-poppins font-black text-4xl text-primary mt-3">COMANDA</h1>
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

    </div>

  )
}





export default Kitchen;


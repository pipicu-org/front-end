import Comanda from "./components/comanda";
import TablaDeFuegos from "./components/tablaDeFuegos";

const Kitchen = () => {
  return (
    <div className="grid grid-cols-7 items-stretch gap-7">
      <div className="col-span-4">
        <TablaDeFuegos/>
      </div>
      <div className="col-span-3 flex flex-col">
        <Comanda/>
        
      </div>
    </div>
  )
}

export default Kitchen;

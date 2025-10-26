import Command from "./components/command";
import FireTable from "./components/fireTable";

const Kitchen = () => {
  return (
    <div className="grid grid-cols-7 items-stretch gap-7">
      <div className="col-span-4">
        <FireTable/>
      </div>
      <div className="col-span-3 flex flex-col">
        <Command/>

      </div>
    </div>
  )
}

export default Kitchen;

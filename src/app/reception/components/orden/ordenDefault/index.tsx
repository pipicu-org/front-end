import Image from "next/image";

const OrdenDefault = () => {


    return (
        <div className="flex flex-col items-center justify-center text-center font-poppins text-primary">
            <span className="text-[150px] font-black opacity-10 w-full text-right pr-10">+</span>
            <div>
                <div>
                    <h1 className="text-5xl font-black">20:02</h1>
                    <Image src="relog" alt="" width={150} height={150} />
                </div>
                <span className="text-sm font-light">Nuevo pedido en 30&rsquo;</span>
            </div>
            <h1 className=" font-black text-[60px] opacity-40 pt-4">+ORDEN</h1>
        </div>
    )
}

export default OrdenDefault;

const OrdenDefault = () => {


    return (
        <div className="flex flex-col items-center justify-center text-center font-poppins text-primary">
            <span className="text-[150px] font-black opacity-10 w-full text-right pr-10">+</span>
            <div>
                <div>
                    <h1 className="text-5xl font-black">20:02</h1>
                    <svg width="150" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13h-1v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill="currentColor"/>
                    </svg>
                </div>
                <span className="text-sm font-light">Nuevo pedido en 30&rsquo;</span>
            </div>
            <h1 className=" font-black text-[60px] opacity-40 pt-4">+ORDEN</h1>
        </div>
    )
}

export default OrdenDefault;



const Orden = () => {
    return (
        <>
        <div 
                style={{
                    background: `linear-gradient(
                      135deg,
                      rgba(161, 161, 161, 0.5) 0%,
                      rgba(161, 161, 161, 0.05) 66%,
                      rgba(161, 161, 161, 0.6) 100%
                    ), #ffffff`
                }} 
                className="w-[100px] h-[100px] rounded-xl p-3 text-center drop-shadow-orden flex flex-col">
                    <span className="text-primary text-xs ">Esteban</span>
                    <h4 className="font-bold text-primary text-sm ">20:30</h4>
                    <h1 className="font-black text-3xl text-primary mt-2 ">#321</h1>
                </div>
        </>
    )
}

export default Orden;
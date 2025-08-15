import { Button } from "@heroui/react";

const OrderCard = () => {
    const orderStyle = {
        background: `linear-gradient(
            135deg,
            rgba(161, 161, 161, 0.5) 0%,
            rgba(161, 161, 161, 0.05) 66%,
            rgba(161, 161, 161, 0.6) 100%
        ), #ffffff`
    }

    return (
        <Button
            style={orderStyle}
            className="min-w-fit aspect-square w-[90px] h-[90px] rounded-xl p-3 text-center drop-shadow-orden flex flex-col"
        >
            <div>
                <span className="text-primary text-xs ">Esteban</span>
                <h4 className="font-bold text-primary text-sm ">20:30</h4>
                <h1 className="font-black text-3xl text-primary">#321</h1>
            </div>
        </Button>
    )
}

export default OrderCard;
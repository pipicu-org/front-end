"use client";
import { Button } from "@heroui/react";
import { useDrag } from "react-dnd";
import { IOrder } from "@/app/types/orders.type";

interface OrdenProps {
    orden: IOrder;
    cambiarOrden?: (nuevaOrden: IOrder) => void;
    kitchen?: boolean;
}

const OrderCard = ({ orden, cambiarOrden, kitchen }: OrdenProps) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'order',
        item: { id: orden.id, currentState: orden.state },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const formatDate = (dateString: string): { date: string, time: string } => {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' }),
            time: date.toLocaleTimeString(undefined, options)
        };
    }

    return (
        // @ts-expect-error React DnD ref type issue
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            <Button
                style={{
                    background: `linear-gradient(
                          135deg,
                          rgba(161, 161, 161, 0.5) 0%,
                          rgba(161, 161, 161, 0.05) 66%,
                          rgba(161, 161, 161, 0.6) 100%
                        ), #ffffff`
                }}
                className="min-w-fit aspect-square w-[7rem] h-[7rem] rounded-xl p-3 text-center drop-shadow-orden flex flex-col"
                onClick={() => cambiarOrden?.(orden)} >
            {!kitchen ? (
                <div className="max-w-xs">
                    <span className="text-primary text-xs block whitespace-normal leading-none ">{orden.name}</span>
                    <h4 className="font-bold text-primary text-sm">{formatDate(orden.deliveryTime).date}</h4>
                    <h4 className="font-bold text-primary text-sm">{formatDate(orden.deliveryTime).time}</h4>
                    <h1 className="font-black text-3xl text-primary">#{orden.id}</h1>
                </div>
            ) : (
                <div>
                    <h4 className="font-bold text-primary text-sm">{formatDate(orden.deliveryTime).date}</h4>
                    <h4 className="font-bold text-primary text-sm">{formatDate(orden.deliveryTime).time}</h4>
                    <span className="text-xs text-gray-500">{orden.deliveryTime}</span>
                </div>
            )}
            </Button>
        </div>
    )
}

export default OrderCard;

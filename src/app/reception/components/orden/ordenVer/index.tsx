
"use client";

import { useState, useEffect } from "react";
import IconButton from "@/app/components/iconButton";
import Input from "@/app/components/input";
import { getOrderById, IOrderDetail, IOrderDetailLine } from "@/app/services/order.service";
import { IOrder } from "@/app/types/orders.type";

interface OrdenVerProps {
    orden: IOrder | null;
}

const OrdenVer = ({ orden }: OrdenVerProps) => {
    const [orderDetails, setOrderDetails] = useState<IOrderDetail | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (orden?.id) {
            setLoading(true);
            getOrderById(orden.id)
                .then(setOrderDetails)
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setOrderDetails(null);
        }
    }, [orden?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <span>Cargando...</span>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="flex items-center justify-center h-full">
                <span>Selecciona una orden para ver detalles</span>
            </div>
        );
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const getPaymentIcon = (method: string) => {
        switch (method) {
            case 'cash': return 'efectivo-solid-dark';
            case 'transfer': return 'transference-outline-dark';
            case 'card': return 'creditCard-solid-dark';
            default: return 'payment-outline-dark';
        }
    };

    return (
        <>
            <div className="relative">
                <p className="absolute inset-0 top-7 left-75 z-0 text-9xl text-black/20 font-black">#{orderDetails.id}</p>

                <div className="relative z-10">

                    <div className="grid grid-cols-5 gap-3 h-full">

                        <div className="col-span-3 text-primary font-poppins p-4">
                            <div>
                                <div className="flex flex-col">
                                    <span className="flex text-3xl font-black">{formatTime(orderDetails.deliveryTime)}</span>
                                    <span className="text-sm">Hora de entrega</span>
                                </div>
                            </div>

                            <div className="pt-5 flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <span className="font-black">¿Quién?</span>
                                    <Input value={orderDetails.client} icon={"user-solid-primary"} />
                                </div>

                                {/* Métodos de contacto */}
                                <div className="flex justify-between">
                                    <IconButton nombre={"Whatsapp"} icon={"whatsapp-solid-dark"} />
                                    <IconButton nombre={"Instagram"} icon={"instagram-solid-dark"} />
                                    <IconButton nombre={"Facebook"} icon={"facebook-solid-dark"} />
                                    <IconButton nombre={"Otro"} icon={"share-solid-dark"} />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-3">
                                        <Input value={orderDetails.phone} icon={"phone-outline-primary"} />
                                    </div>
                                    <Input value={orderDetails.address} icon={"www-outline-primary"} />
                                </div>

                                {/* Método de pago */}
                                <div className="flex flex-col gap-2">
                                    <span className="font-black">¿Cómo?</span>
                                    <div className="flex justify-between">
                                        <IconButton
                                            nombre={orderDetails.paymentMethod === 'cash' ? "Efectivo" :
                                                orderDetails.paymentMethod === 'transfer' ? "Transferencia" :
                                                    orderDetails.paymentMethod === 'card' ? "Débito" : "Otros"}
                                            icon={getPaymentIcon(orderDetails.paymentMethod)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 p-4 text-primary">
                            <div className="flex justify-end items-center">
                                <div className="inline-flex items-center gap-2  pr-2 pl-2  mt-2 bg-primary/30 rounded-full">
                                    {/* ~~~ Pelotita ~~~ */}
                                    <div className="w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_5px_rgba(255,255,255,1)]"></div>
                                    <h2 className="ml-1 font-bold text-white font-normal text-poppins">{orderDetails.state}</h2>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-black text-lg"> RESUMEN</h3>
                                <h4 className="font-black mb-2 ">Productos</h4>
                                <div className="space-y-2">
                                    {orderDetails.lines.map((line: IOrderDetailLine) => (
                                        <div key={line.id} className="rounded-lg pl-2 pr-2 bg-primary/20 hover:bg-primary/30 duration-150">
                                            <div className="flex justify-between">
                                                <span className="font-medium">{line.product}</span>
                                                <span>${line.totalPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="text-sm text-black/80">
                                                Cantidad: {parseInt(line.quantity)} | Estado: {line.state}
                                            </div>
                                            {line.personalization.length > 0 && (
                                                <div className="text-sm">
                                                    Personalizaciones: {JSON.stringify(line.personalization)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="pt-2 text-lg"><span className="font-black">Total:</span> ${orderDetails.totalPrice}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrdenVer;

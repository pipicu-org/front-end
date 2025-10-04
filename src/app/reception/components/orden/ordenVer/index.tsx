
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

            <div className="col-span-2 p-4">
                <div className="mb-4">
                    <h3 className="font-black text-lg">RESUMEN</h3>
                    <p>ID: {orderDetails.id}</p>
                    <p>Estado: {orderDetails.state}</p>
                    <p>Total: ${orderDetails.totalPrice}</p>
                </div>

                <div>
                    <h4 className="font-black mb-2">Productos</h4>
                    <div className="space-y-2">
                        {orderDetails.lines.map((line: IOrderDetailLine) => (
                            <div key={line.id} className="border rounded p-2">
                                <div className="flex justify-between">
                                    <span className="font-medium">{line.product}</span>
                                    <span>${line.totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Cantidad: {line.quantity} | Estado: {line.state}
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
            </div>
        </div>
    );
};

export default OrdenVer;

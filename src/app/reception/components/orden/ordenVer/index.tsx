
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import IconButton from "@/app/components/iconButton";
import Input from "@/app/components/input";
import { getOrderById, updateOrderState } from "@/app/services/order.service";
import { IOrder, IOrderDetail, IOrderDetailLine } from "@/app/types/orders.type";
import { Button } from "@heroui/react";

interface OrdenVerProps {
     orden: IOrder | null;
     onClose?: () => void;
     onEdit?: () => void;
     onDelete?: () => void;
     onOrderStateChange?: () => void;
  }

const OrdenVer = ({ orden, onClose, onEdit, onDelete, onOrderStateChange }: OrdenVerProps) => {
    const [orderDetails, setOrderDetails] = useState<IOrderDetail | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (orden?.id) {
            setLoading(true);
            getOrderById(orden.id)
                .then((details) => {
                    setOrderDetails(details);
                    // Update the order state in the parent component
                    if (orden && details.state !== orden.state) {
                        // The state has changed, we need to update the parent
                        // This will be handled by onOrderStateChange callback
                    }
                })
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
        <div className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 flex-1 overflow-y-auto max-h-full">
                <div className="md:col-span-3 text-primary font-poppins p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                            <span className="flex text-3xl font-black">{formatTime(orderDetails.deliveryTime)}</span>
                            <span className="text-sm">Hora de entrega</span>
                        </div>
                        <Button
                            type="button"
                            size="sm"
                            className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/20 text-white"
                            onPress={onClose}>
                            x
                        </Button>
                    </div>

                    <div className="pt-5 flex flex-col gap-4">
                        <span className="font-black">¿Quién?</span>
                        <div className="flex flex-col gap-3">
                            <Input value={orderDetails.client} icon={"user-solid-primary"} />
                            <div className="flex items-center gap-2">
                                <div className="w-full">
                                    <Input
                                        value={orderDetails.phoneNumber}
                                        icon={"phone-outline-primary"} />
                                </div>
                                <Link
                                    href={`https://wa.me/${orderDetails.phoneNumber}`}
                                    target="_blank">
                                    <div className="flex gap-1 items-center underline hover:text-violet-900">
                                        <span className="leading-4">
                                            ir a whatsapp
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                    </div>
                                </Link>
                            </div>
                            <Input value={orderDetails.address} icon={"www-outline-primary"} />
                        </div>

                        {/* Métodos de contacto */}
                        <div className="flex justify-between">
                            <IconButton nombre={"Whatsapp"} icon={"whatsapp-solid-dark"} />
                            <IconButton nombre={"Instagram"} icon={"instagram-solid-dark"} />
                            <IconButton nombre={"Facebook"} icon={"facebook-solid-dark"} />
                            <IconButton nombre={"Otro"} icon={"share-solid-dark"} />
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

                <div className="md:col-span-2 p-4">
                    <div className="mb-4">
                        <h3 className="font-black text-lg">RESUMEN</h3>
                        <p>ID: {orderDetails.id}</p>
                        <p>Estado: {orderDetails.state}</p>
                        <p>Total: ${orderDetails.total}</p>
                        <div className="flex gap-2 mt-2">
                            <Button
                                type="button"
                                size="sm"
                                className="px-4 py-2 bg-primary text-white rounded-md"
                                onPress={onEdit}>
                                Editar Orden
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                className="px-4 py-2 bg-green-500 text-white rounded-md"
                                onPress={() => {
                                    updateOrderState(parseInt(orderDetails.id), 5)
                                        .then(() => {
                                            alert("Orden completada exitosamente");
                                            onOrderStateChange?.();
                                            onClose?.();
                                        })
                                        .catch((error: any) => {
                                            console.error("Error completing order:", error);
                                            alert("Error al completar la orden");
                                        });
                                }}>
                                Completar
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => {
                                    if (window.confirm("¿Estás seguro de que quieres cancelar esta orden?")) {
                                        updateOrderState(parseInt(orderDetails.id), 6)
                                            .then(() => {
                                                alert("Orden cancelada exitosamente");
                                                onOrderStateChange?.();
                                                onClose?.();
                                            })
                                            .catch((error: any) => {
                                                console.error("Error canceling order:", error);
                                                alert("Error al cancelar la orden");
                                            });
                                    }
                                }}>
                                Cancelar
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-black mb-2">Productos</h4>
                        <div className="space-y-2">
                            {orderDetails.lines && orderDetails.lines.map((line: IOrderDetailLine) => (
                                <div key={line.id} className="border rounded p-2">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{line.product.name}</span>
                                        <span>${line.totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Cantidad: {line.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdenVer;

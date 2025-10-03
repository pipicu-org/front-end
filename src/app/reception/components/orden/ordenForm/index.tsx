

"use client";

import { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { createOrder, updateOrder } from "@/app/services/order.service";
import { searchClients } from "@/app/services/clients.service";

interface OrdenFormProps {
    orden: IOrder | null;
    isEdit: boolean;
    onSave?: (order: IOrder) => void;
}

interface IOrderLine {
    product: number;
    quantity: number;
    personalizations: unknown[];
}

interface IOrderPayload {
    client: number;
    deliveryTime: string;
    paymentMethod: string;
    lines: IOrderLine[];
}

const OrdenForm = ({ orden, isEdit, onSave }: OrdenFormProps) => {
    const [client, setClient] = useState<number>(orden?.client ? Number(orden.client) : 0);
    const [deliveryTime, setDeliveryTime] = useState<string>(orden?.deliveryTime || "");
    const [paymentMethod, setPaymentMethod] = useState<string>(orden?.paymentMethod || "cash");
    const [lines, setLines] = useState<IOrderLine[]>([{ product: 1, quantity: 1, personalizations: [] }]);
    const [clients, setClients] = useState<IClient[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        searchClients('', 1).then(response => {
            setClients(response.data);
        }).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload: IOrderPayload = {
            client,
            deliveryTime,
            paymentMethod,
            lines,
        };

        try {
            let result;
            if (isEdit && orden) {
                result = await updateOrder(orden.id, payload);
            } else {
                result = await createOrder(payload);
            }
            onSave?.(result);
        } catch (error) {
            console.error("Error saving order:", error);
        } finally {
            setLoading(false);
        }
    };

    const addLine = () => {
        setLines([...lines, { product: 1, quantity: 1, personalizations: [] }]);
    };

    const updateLine = (index: number, field: keyof IOrderLine, value: any) => {
        const newLines = [...lines];
        (newLines[index] as any)[field] = value;
        setLines(newLines);
    };

    const removeLine = (index: number) => {
        setLines(lines.filter((_, i) => i !== index));
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">{isEdit ? "Editar Orden" : "Nueva Orden"}</h2>

            <Select
                label="Cliente"
                placeholder="Seleccionar cliente"
                selectedKeys={client ? [client.toString()] : []}
                onSelectionChange={(keys) => setClient(Number(Array.from(keys)[0]))}
            >
                {clients.map((c) => (
                    <SelectItem key={c.id.toString()}>
                        {c.name}
                    </SelectItem>
                ))}
            </Select>

            <Input
                label="Hora de entrega"
                type="datetime-local"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                required
            />

            <Select
                label="Método de pago"
                selectedKeys={[paymentMethod]}
                onSelectionChange={(keys) => setPaymentMethod(Array.from(keys)[0] as string)}
            >
                <SelectItem key="cash">Efectivo</SelectItem>
                <SelectItem key="card">Tarjeta</SelectItem>
                <SelectItem key="transfer">Transferencia</SelectItem>
            </Select>

            <div>
                <h3 className="text-lg font-semibold mb-2">Productos</h3>
                {lines.map((line, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                        <Input
                            label="Producto ID"
                            type="number"
                            value={line.product.toString()}
                            onChange={(e) => updateLine(index, 'product', Number(e.target.value))}
                            required
                        />
                        <Input
                            label="Cantidad"
                            type="number"
                            value={line.quantity.toString()}
                            onChange={(e) => updateLine(index, 'quantity', Number(e.target.value))}
                            required
                        />
                        <Button type="button" onClick={() => removeLine(index)} color="danger">
                            Eliminar
                        </Button>
                    </div>
                ))}
                <Button type="button" onClick={addLine} className="mt-2">
                    Agregar Producto
                </Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Guardando..." : (isEdit ? "Actualizar" : "Crear")}
            </Button>
        </form>
    );
};

export default OrdenForm;

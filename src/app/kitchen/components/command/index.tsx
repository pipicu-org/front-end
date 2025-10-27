"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IComandaOrder } from "@/app/types/orders.type";
import { getComandaOrders } from "@/app/services/kitchen.service";

const Command = () => {
    const [orders, setOrders] = useState<IComandaOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getComandaOrders();
            setOrders(response.data);
        } catch (err) {
            setError("Error al cargar las comandas");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order =>
        order.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderId.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex flex-col">
                <div className="font-poppins font-black text-4xl text-primary mt-3">COMANDA</div>
                <div className="mt-4">Cargando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col">
                <div className="font-poppins font-black text-4xl text-primary mt-3">COMANDA</div>
                <div className="mt-4 text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div>
                <h1 className="font-poppins font-black text-4xl text-primary mt-3">COMANDA</h1>
            </div>

            {/* Main */}
            <div className="flex flex-col">
                <div className="flex justify-between mt-4">
                    <h1><span>{filteredOrders.length}</span> Comandas en curso</h1>
                    <div className="inline-flex justify-center items-center rounded-full pl-3 pr-3">
                        <input
                            className=""
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Image className="w-5 h-5 opacity-25" src="/lupa.png" alt="" width={20} height={20} />
                    </div>
                </div>

                {/* Table */}
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Orden</th>
                                <th className="p-2 text-left">Cliente</th>
                                <th className="p-2 text-left">Productos</th>
                                <th className="p-2 text-left">Ingredientes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map(order => (
                                <tr key={order.orderId} className="border-b">
                                    <td className="p-2 font-semibold">#{order.orderId}</td>
                                    <td className="p-2">{order.client.name}</td>
                                    <td className="p-2">
                                        <div className="flex flex-col gap-1">
                                            {order.lines.map(line => (
                                                <div key={line.lineId} className="bg-green-100 px-2 py-1 rounded text-sm">
                                                    {line.product.name} x{line.quantity}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="text-sm text-gray-600 max-w-xs">
                                            {order.lines.map(line => (
                                                <div key={line.lineId} className="mb-2">
                                                    <div className="font-medium">{line.product.name}:</div>
                                                    {line.recipe.map((recipeItem, index) => (
                                                        <div key={index} className="ml-2">
                                                            {recipeItem.ingredient.name}: {recipeItem.quantity} {recipeItem.unit.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Command;
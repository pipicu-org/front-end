"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { IKitchenOrderItem } from "@/app/types/orders.type";
import { getKitchenOrders, getKitchenProducts } from "@/app/services/kitchen.service";

interface ProductVisibility {
  [productId: number]: boolean;
}

const FireTable = () => {
    const [orders, setOrders] = useState<IKitchenOrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
    const [productVisibility, setProductVisibility] = useState<ProductVisibility>({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersResponse, productsList] = await Promise.all([
                getKitchenOrders(1, 100), // Get more data for better display
                getKitchenProducts()
            ]);

            setOrders(ordersResponse.data);
            setProducts(productsList);

            // Initialize all products as visible
            const visibility: ProductVisibility = {};
            productsList.forEach(product => {
                visibility[product.id] = true;
            });
            setProductVisibility(visibility);
        } catch (err) {
            setError("Error al cargar los datos de la tabla de fuegos");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleProductVisibility = (productId: number) => {
        setProductVisibility(prev => ({
            ...prev,
            [productId]: !prev[productId]
        }));
    };

    // Group orders by product
    const groupedOrders = orders.reduce((acc, order) => {
        const productId = order.product.id;
        if (!acc[productId]) {
            acc[productId] = {
                product: order.product,
                items: []
            };
        }
        acc[productId].items.push(order);
        return acc;
    }, {} as Record<number, { product: { id: number; name: string }, items: IKitchenOrderItem[] }>);

    // Filter products based on visibility and search
    const filteredProducts = Object.values(groupedOrders).filter(group =>
        productVisibility[group.product.id] &&
        group.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col">
                <div className="font-poppins font-black text-4xl text-primary mt-3">TABLA DE FUEGOS</div>
                <div className="mt-4">Cargando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col">
                <div className="font-poppins font-black text-4xl text-primary mt-3">TABLA DE FUEGOS</div>
                <div className="mt-4 text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Header */}
            <div>
                <h1 className="font-poppins font-black text-4xl text-primary mt-3">TABLA DE FUEGOS</h1>
            </div>

            {/* Main */}
            <div className="flex flex-col">
                <div className="flex justify-between mt-4">
                    <h1><span>{filteredProducts.length}</span> Productos en la tabla</h1>
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

                {/* Product Visibility Toggles */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {products.map(product => (
                        <button
                            key={product.id}
                            onClick={() => toggleProductVisibility(product.id)}
                            className={`px-3 py-1 rounded-full text-sm ${
                                productVisibility[product.id]
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-200 text-gray-600'
                            }`}
                        >
                            {product.name}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Producto</th>
                                <th className="p-2 text-left">Preparaciones</th>
                                <th className="p-2 text-left">Ingredientes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(group => (
                                <tr key={group.product.id} className="border-b">
                                    <td className="p-2 font-semibold">{group.product.name}</td>
                                    <td className="p-2">
                                        <div className="flex flex-wrap gap-2">
                                            {group.items.map(item => (
                                                <div key={`${item.orderId}-${item.preparationId}`} className="bg-blue-100 px-2 py-1 rounded text-sm">
                                                    Orden {item.orderId} - {item.quantity}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-2">
                                        <div className="text-sm text-gray-600">
                                            {group.items[0]?.recipeIngredients.map(ingredient => (
                                                <div key={ingredient.ingredientId}>
                                                    {ingredient.ingredientName}: {ingredient.quantity} {ingredient.unitName}
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

export default FireTable;
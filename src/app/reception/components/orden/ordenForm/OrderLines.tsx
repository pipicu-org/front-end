import { Button } from "@heroui/react";
import { IProduct } from "../../../../types/products.type";

interface IOrderLine {
    product: number;
    quantity: number;
    personalizations: unknown[];
}

interface OrderLinesProps {
    lines: IOrderLine[];
    products: IProduct[];
    selectedProducts: { [key: number]: IProduct };
    removeLine: (index: number) => void;
}

const OrderLines = ({ lines, products, selectedProducts }: OrderLinesProps) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Resumen</h3>
            <div className="p-2 max-h-64 overflow-y-auto">
                {lines.length
                    ? lines.map((line, index) => {
                        const product = selectedProducts[line.product] || products.find(p => p.id === line.product);
                        return (
                            <div key={index} className="flex justify-between py-1 items-center last:border-b-0">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 ml-2">x{line.quantity}</span>
                                    <span className="font-semibold text-left leading-4 w-24 max-w-24">{product?.name || `Producto ${line.product}`}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 ml-2">${((product?.price || 0) * line.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        );
                    })
                    : <p className="text-gray-500">No hay productos en la orden.</p>
                }
            </div>
        </div>
    );
};

export default OrderLines;

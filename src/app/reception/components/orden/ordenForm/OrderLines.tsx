import { Button } from "@heroui/react";

interface IOrderLine {
    product: number;
    quantity: number;
    personalizations: unknown[];
}

interface OrderLinesProps {
    lines: IOrderLine[];
    products: IProduct[];
    removeLine: (index: number) => void;
}

const OrderLines = ({ lines, products, removeLine }: OrderLinesProps) => {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Productos en la Orden</h3>
            <div className="p-2 max-h-64 overflow-y-auto">
                {lines.length
                    ? lines.map((line, index) => {
                        const product = products.find(p => p.id === line.product);
                        return (
                            <div key={index} className="flex flex-col justify-between py-1 items-center border-b last:border-b-0">
                                <div className="flex justify-between w-full items-center">
                                    <span className="font-medium">{product?.name || `Producto ${line.product}`}</span>
                                    <Button type="button" size="sm" onClick={() => removeLine(index)} color="danger" className="px-2 py-1">
                                        🗑️
                                    </Button>
                                </div>
                                <div className="flex justify-between w-full items-center">
                                    <span className="text-sm text-gray-600 ml-2">x{line.quantity}</span>
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
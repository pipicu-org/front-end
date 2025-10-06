import { Button, Divider } from "@heroui/react";
import { IProduct } from "../../../../types/products.type";

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
    const getTotal = () => lines.reduce((sum, line) => {
        const product = products.find(p => p.id === line.product);
        return sum + ((product?.price || 0) * line.quantity);
    }, 0);

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Resumen</h3>
            <div className="p-2 overflow-y-auto h-[470px]">
                {lines.length
                    ? lines.map((line, index) => {
                        const product = products.find(p => String(p.id) === String(line.product));
                        return (
                            <div key={index} className="flex justify-between py-1 items-center last:border-b-0">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 ml-2">x{line.quantity}</span>
                                    <span className="font-semibold text-left leading-4 w-24 max-w-24">{product?.name || `Producto ${line.product}`}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-gray-600 ml-2">${((product?.price || 0) * line.quantity).toFixed(2)}</span>
                                    <Button
                                        type="button"
                                        size="sm"
                                        className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full"
                                        onPress={() => removeLine(index)}
                                        color="danger">
                                        x
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                    : <p className="text-gray-500">No hay productos en la orden.</p>
                }
            </div>
            <Divider className="my-2"/>
            <div className="w-full flex justify-end font-semibold">
                <span>{getTotal()}$</span>
            </div>
        </div>
    );
};

export default OrderLines;

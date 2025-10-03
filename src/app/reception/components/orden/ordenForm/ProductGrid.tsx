import { Button, Select, SelectItem, Card, CardBody, Divider, Tabs, Tab } from "@heroui/react";
import { ICategory } from "@/app/types/categories.type";

interface IOrderLine {
    product: number;
    quantity: number;
    personalizations: unknown[];
}

interface ProductGridProps {
    products: IProduct[];
    productLoading: boolean;
    productError: string | null;
    categories: ICategory[];
    categoriesLoading: boolean;
    categoriesError: string | null;
    selectedCategory: number | undefined;
    setSelectedCategory: (category: number | undefined) => void;
    lines: IOrderLine[];
    productQuantities: { [key: number]: number };
    changeProductQuantity: (productId: number, delta: number) => void;
    upsertOrderProduct: (product: IProduct) => void;
    openProductModal: (mode: 'create' | 'edit', product?: IProduct) => void;
}

const ProductGrid = ({
    products,
    productLoading,
    productError,
    categories,
    categoriesLoading,
    categoriesError,
    selectedCategory,
    setSelectedCategory,
    lines,
    productQuantities,
    changeProductQuantity,
    upsertOrderProduct,
    openProductModal
}: ProductGridProps) => {

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Menú de Productos</h3>
                <Button onPress={() => openProductModal('create')} className="bg-black/10 hover:bg-black/20">
                    Gestionar Productos
                </Button>
            </div>
            <Tabs
                aria-label="Categorías"
                selectedKey={selectedCategory}
                onSelectionChange={(key) => setSelectedCategory(key ? Number(key) : undefined)}
            >
                {categories.map((category) => (
                    <Tab key={category.id.toString()} title={category.name}>
                        {category.name}
                    </Tab>
                ))}
            </Tabs>
            {categoriesLoading && <p>Cargando categorías...</p>}
            {categoriesError && <p className="text-red-500">{categoriesError}</p>}
            {productLoading && <p>Cargando productos...</p>}
            {productError && <p className="text-red-500">{productError}</p>}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-2 mt-4 max-h-96">
                {products.map((product) => (
                    <Card className="w-full rounded-full p-0 bg-black/10" key={product.id}>
                        <CardBody className="flex flex-col items-center text-center p-0">
                            <div className="flex justify-between items-center w-full px-2 gap-1">
                                <div className="flex items-center py-2 w-fit h-full max-w-[70%] justify-between space-x-2">
                                    <h4 className="font-semibold text-left leading-4 w-24 max-w-24">{product.name}</h4>
                                    <Divider orientation="vertical"/>
                                    <p className="text-gray-600">${product.price}</p>
                                </div>
                                <div className="flex flex-col items-center space-x-1 mt-2">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Button
                                            size="sm"
                                            color="primary"
                                            className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/80"
                                            onPress={() => {changeProductQuantity(product.id, -1)}}>-</Button>
                                        <span className="text-sm">{productQuantities[product.id] || 0}</span>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/80"
                                            onPress={() => {changeProductQuantity(product.id, 1)}}>+</Button>
                                    </div>
                                </div>
                                <div>
                                    {lines.some(line => String(line.product) === String(product.id))
                                        ? <Button size="sm" className="px-1 py-0" onClick={() => upsertOrderProduct(product)}>
                                            Editar
                                        </Button>
                                        : <Button size="sm" className="px-1 py-0" color="primary" onClick={() => upsertOrderProduct(product)}>
                                            Agregar
                                        </Button>
                                    }
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ProductGrid;
import { Button, Card, CardBody, Divider, Tabs, Tab } from "@heroui/react";
import { ICategory } from "@/app/types/categories.type";
import { IProduct } from "../../../../types/products.type";

interface ProductGridProps {
    products: IProduct[];
    productLoading: boolean;
    productError: string | null;
    categories: ICategory[];
    categoriesLoading: boolean;
    categoriesError: string | null;
    selectedCategory: number | undefined;
    setSelectedCategory: (category: number | undefined) => void;
    productQuantities: { [key: number]: number };
    changeProductQuantity: (productId: number, delta: number) => void;
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
    productQuantities,
    changeProductQuantity,
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
            <div className="flex flex-col md:flex-row md:flex-wrap gap-2 mt-4 md:max-h-96">
                {products.map((product) => (
                    <Card className="w-full rounded-full p-0 bg-black/10" key={product.id}>
                        <CardBody className="flex flex-col items-center text-center p-0">
                            <div className="flex justify-between items-center w-full px-2 gap-1">
                                <div className="flex items-center py-2 w-fit h-full max-w-[70%] justify-between space-x-2">
                                    <h4 className="font-semibold text-left leading-4 w-24 max-w-24">{product.name}</h4>
                                    <Divider orientation="vertical" />
                                    <p className="text-gray-600">${product.price}</p>
                                </div>
                                <div className="flex flex-col items-center space-x-1 mt-2">
                                    <div className="flex items-center space-x-2 mb-2">
                                        {productQuantities[product.id]
                                            ? <Button
                                                size="sm"
                                                color="primary"
                                                className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/80"
                                                onPress={() => { changeProductQuantity(product.id, -1) }}>
                                                {productQuantities[product.id] === 1
                                                    ? <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                    : '-'}
                                            </Button>
                                            : <></>}
                                        <span className="text-sm">{productQuantities[product.id] || 0}</span>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/80"
                                            onPress={() => { changeProductQuantity(product.id, 1) }}>+</Button>
                                    </div>
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

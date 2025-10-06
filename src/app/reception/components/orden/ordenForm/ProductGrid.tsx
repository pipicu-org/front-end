import { Button, Card, CardBody, Divider, Tabs, Tab } from "@heroui/react";
import { ICategory } from "@/app/types/categories.type";
import { IProduct } from "../../../../types/products.type";

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

    const style = {
        background: `linear-gradient(
                      135deg,
                      rgba(161, 161, 161, 0.5) 0%,
                      rgba(161, 161, 161, 0.05) 66%,
                      rgba(161, 161, 161, 0.6) 100%
                    ), #ffffff`
    }

    return (
        <div className="bg-black/10 p-2 rounded-lg">
            <div className="flex justify-between items-center mb-2 ">
                <h3 className="text-xl text-primary font-black">Menú de Productos</h3>
                <Button onPress={() => openProductModal('create')} style={style} className="flex flex-col items-center justify-center rounded-2xl text-primary">
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
            <div className="flex flex-col md:flex-row md:flex-wrap gap-2 mt-4 max-h-66 overflow-y-auto">
                {products.map((product) => (
                    <Card className="w-full rounded-full p-0 bg-black/10" key={product.id}>
                        <CardBody className="flex flex-col items-center text-center p-0">
                            <div className="flex justify-between items-center w-full px-2 gap-1">
                                {/* Información del producto */}
                                <div className="flex items-center py-2 w-fit h-full max-w-[70%] justify-between space-x-2">
                                    <h4 className="font-semibold text-left leading-4 w-24 max-w-24">{product.name}</h4>
                                    <Divider orientation="vertical" />
                                    <p className="text-gray-600">${product.price}</p>
                                </div>

                                {/* Botones de cantidad */}
                                <div className="flex items-center space-x-2">
                                    <Button
                                        size="sm"
                                        color="primary"
                                        className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/80"
                                        onPress={() => changeProductQuantity(product.id, -1)}
                                    >
                                        -
                                    </Button>

                                    <span className="text-sm">{productQuantities[product.id] || 0}</span>

                                    <Button
                                        size="sm"
                                        color="primary"
                                        className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/80"
                                        onPress={() => changeProductQuantity(product.id, 1)}
                                    >
                                        +
                                    </Button>
                                </div>

                                {/* Botón agregar/editar */}
                                <div>
                                    {lines.some(line => String(line.product) === String(product.id)) ? (
                                        <Button size="sm" className="px-1 py-0" onPress={() => upsertOrderProduct(product)}>
                                            Editar
                                        </Button>
                                    ) : (
                                        <Button size="sm" className="px-1 py-0" color="primary" onPress={() => upsertOrderProduct(product)}>
                                            Agregar
                                        </Button>
                                    )}
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

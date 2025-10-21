import { Divider, Tab, Tabs } from "@heroui/react";
import { ICategory } from "@/app/types/categories.type";
import { IProduct } from "../../../../types/products.type";
import { useState } from "react";
import CustomProductModal from "../../customProductModal/CustomProductModal";

interface ProductGridProps {
    products: IProduct[];
    productLoading: boolean;
    productError: string | null;
    categories: ICategory[];
    categoriesLoading: boolean;
    categoriesError: string | null;
    selectedCategory: number | undefined;
    setSelectedCategory: (category: number | undefined) => void;
    productQuantities: { [key: string]: number };
    changeProductQuantity: (productId: string, delta: number) => void;
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
}: ProductGridProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    return (
        <div className="bg-black/10 p-2 rounded-lg max-h-70">
            <Tabs
                aria-label="Categorías"
                defaultSelectedKey={selectedCategory}
                onSelectionChange={(key) => setSelectedCategory(key ? Number(key) : undefined)}
                classNames={{
                    base: "bg-transparent",
                    tabList: "bg-black/10",
                    cursor: "bg-white",
                    tabContent: "text-black group-data-[selected=true]:text-black",

                }}
            >
                {categories.map((category) => (
                    <Tab
                        key={category.id} title={category.name}>
                    </Tab>
                ))}
            </Tabs>







            {categoriesLoading && <p>Cargando categorías...</p>}
            {categoriesError && <p className="text-red-500">{categoriesError}</p>}
            {productLoading && <p>Cargando productos...</p>}
            {productError && <p className="text-red-500">{productError}</p>}
            <div className="flex flex-col overflow-y-auto gap-0 mt-2 md:flex-row md:flex-wrap md:max-h-54" style={{
                // overflowY: "scroll",
                scrollbarWidth: "thin", // solo Firefox
                scrollbarColor: "#3d3d3d #00000000", // solo Firefox
                height: "300px",
            }}>
                {products.map((product) => (
                    // <Card className="w-full rounded-2xl bg-black/20 px-1 self-start h-fit" key={product.id}>
                    <div key={product.id} className="flex w-full items-center gap-2 rounded-2xl bg-black/10 px-2 py-[0.25rem] mt-1">
                        {/* Información del producto - Izquierda */}
                        <div className="flex-1 min-w-0">
                            <span className="font-semibold text-white truncate">
                                {product.name}
                            </span>
                        </div>

                        {/* Derecha - Controles y precio */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <p className="text-white text-sm">${product.price}</p>
                            <Divider orientation="vertical" />

                            {/* Controles de cantidad */}
                            <div className="flex items-center gap-1">
                                {productQuantities[product.id] > 0 && (
                                    <button
                                        type="button"
                                        className="bg-black text-white w-6 h-6 rounded-full text-sm flex items-center justify-center"
                                        onClick={() => changeProductQuantity(product.id, -1)}
                                    >
                                        {productQuantities[product.id] === 1 ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        ) : (
                                            '-'
                                        )}
                                    </button>
                                )}

                                <span className="text-sm text-white min-w-[1ch] text-center">
                                    {productQuantities[product.id] || 0}
                                </span>

                                <button
                                    type="button"
                                    className="bg-black text-white w-6 h-6 rounded-full text-sm flex items-center justify-center"
                                    onClick={() => changeProductQuantity(product.id, 1)}
                                >
                                    +
                                </button>
                            </div>

                            {/* Botón de configuración */}
                            <button
                                type="button"
                                className="hover:text-white rounded-md p-2 flex items-center justify-center"
                                onClick={() => {
                                    setSelectedProduct(product);
                                    setIsModalOpen(true);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </button>
                        </div>
                    </div>



                ))}
            </div>

            {/* Modal de configuración del producto */}
            <CustomProductModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                selectedProduct={selectedProduct}
                productQuantities={productQuantities}
            />
        </div>
    );
};

export default ProductGrid;

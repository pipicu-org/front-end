

"use client";

import { useState, useEffect } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { createOrder, updateOrder } from "@/app/services/order.service";
import { getProducts, createProduct, updateProduct, deleteProduct, getProductsByCategory } from "@/app/services/products.service";
import { searchClients } from "@/app/services/clients.service";
import { getCategories } from "@/app/services/categories.service";
import { ICategory } from "@/app/types/categories.type";
import { IClient } from "@/app/types/clients.type";
import { useToast } from "@/utils/toast";
import ClientSelector from "./ClientSelector";
import ProductGrid from "./ProductGrid";
import OrderLines from "./OrderLines";
import ProductModal from "./ProductModal";

interface OrdenFormProps {
    orden: IOrder | null;
    isEdit: boolean;
    onSave?: (order: IOrder) => void;
    onClose?: () => void;
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

const OrdenForm = ({ orden, isEdit, onSave, onClose }: OrdenFormProps) => {
    const { showToast } = useToast();
    const [client, setClient] = useState<number>(orden?.client ? Number(orden.client) : 0);
    const [deliveryTime, setDeliveryTime] = useState<string>(orden?.deliveryTime || "");
    const [paymentMethod, setPaymentMethod] = useState<string>(orden?.paymentMethod || "cash");
    const [lines, setLines] = useState<IOrderLine[]>([]);
    const [clients, setClients] = useState<IClient[]>([]);
    const [loading, setLoading] = useState(false);


    // Estados para grilla de productos
    const [products, setProducts] = useState<IProduct[]>([]);
    const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [productLoading, setProductLoading] = useState(false);
    const [productError, setProductError] = useState<string | null>(null);

    // Estados para modal de gestión de productos
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [productModalMode, setProductModalMode] = useState<'create' | 'edit'>('create');
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
    const [productForm, setProductForm] = useState({
        name: '',
        price: 0,
        category: 1,
        ingredients: [{ id: 1, quantity: 1 }]
    });
    const [productModalLoading, setProductModalLoading] = useState(false);
    const [productModalError, setProductModalError] = useState<string | null>(null);

    // Estados para categorías
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

    // Seleccionar primera categoría por defecto
    useEffect(() => {
        if (categories.length > 0 && selectedCategory === undefined) {
            setSelectedCategory(categories[0].id);
        }
    }, [categories, selectedCategory]);

    const reloadClients = () => {
        searchClients('', 1).then(response => {
            setClients(response.data);
        }).catch(console.error);
    };

    useEffect(() => {
        reloadClients();
    }, []);

    // Cargar categorías
    useEffect(() => {
        const loadCategories = async () => {
            setCategoriesLoading(true);
            setCategoriesError(null);
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                setCategoriesError("Error al cargar categorías");
                console.error(error);
            } finally {
                setCategoriesLoading(false);
            }
        };
        loadCategories();
    }, []);

    // Cargar productos
    useEffect(() => {
        const loadProducts = async () => {
            setProductLoading(true);
            setProductError(null);
            try {
                let data: IProduct[];
                if (selectedCategory) {
                    const response = await getProductsByCategory(selectedCategory);
                    data = response.data;
                } else {
                    const response = await getProducts(1, 50);
                    data = response.data;
                }
                console.log("Loaded products:", data);
                setProducts(data);
            } catch (error) {
                setProductError("Error al cargar productos");
                console.error(error);
            } finally {
                setProductLoading(false);
            }
        };
        loadProducts();
    }, [selectedCategory]);

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
                showToast("Orden creada exitosamente", "success");
            }
            onSave?.(result);
        } catch (error) {
            console.error("Error saving order:", error);
        } finally {
            setLoading(false);
        }
    };

    // Función addLine removida ya que ahora se agregan productos desde la grilla

    const updateLine = (index: number, field: keyof IOrderLine, value: number | unknown[]) => {
        const newLines = [...lines];
        (newLines[index] as Record<keyof IOrderLine, number | unknown[]>)[field] = value;
        setLines(newLines);
    };

    const removeLine = (index: number) => {
        setLines(lines.filter((_, i) => i !== index));
    };


    // Función para cambiar cantidad de producto
    const changeProductQuantity = (productId: number, delta: number) => {
        console.log("Changing quantity for product", productId, "by", delta);
        console.log("Current quantities:", productQuantities);
        setProductQuantities(prev => ({
                ...prev,
                [productId]: Math.max(0, (prev[productId] || 0) + delta)
            }));
    };

    // Función para agregar producto a la orden
    const upsertOrderProduct = (product: IProduct) => {
        const quantity = productQuantities[product.id] || 0;
        if (quantity > 0) {
            const existingIndex = lines.findIndex(line => String(line.product) === String(product.id));
            if (existingIndex >= 0) {
                updateLine(existingIndex, 'quantity', quantity);
            } else {
                setLines([...lines, { product: Number(product.id), quantity, personalizations: [] }]);
            }
        }
    };

    // Función para abrir modal de producto
    const openProductModal = (mode: 'create' | 'edit', product?: IProduct) => {
        setProductModalMode(mode);
        if (mode === 'edit' && product) {
            setSelectedProduct(product);
            setProductForm({
                name: product.name,
                price: product.price,
                category: product.category,
                ingredients: product.ingredients
            });
        } else {
            setSelectedProduct(null);
            setProductForm({
                name: '',
                price: 0,
                category: categories[0]?.id || 1,
                ingredients: [{ id: 1, quantity: 1 }]
            });
        }
        setProductModalOpen(true);
    };

    // Función para guardar producto
    const saveProduct = async () => {
        if (!productForm.name || productForm.price <= 0) {
            setProductModalError("Nombre requerido y precio positivo");
            return;
        }
        setProductModalLoading(true);
        setProductModalError(null);
        try {
            if (productModalMode === 'create') {
                await createProduct(productForm);
            } else if (selectedProduct) {
                await updateProduct(selectedProduct.id, productForm);
            }
            // Recargar productos
            let data: IProduct[];
            if (selectedCategory) {
                const response = await getProductsByCategory(selectedCategory);
                data = response.data;
            } else {
                const response = await getProducts(1, 50);
                data = response.data;
            }
            setProducts(data);
            setProductModalOpen(false);
        } catch (error) {
            setProductModalError("Error al guardar producto");
            console.error(error);
        } finally {
            setProductModalLoading(false);
        }
    };

    // Función para eliminar producto
    const deleteProductHandler = async () => {
        if (!selectedProduct) return;
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        setProductModalLoading(true);
        try {
            await deleteProduct(selectedProduct.id);
            // Recargar productos
            const response = await getProducts(1, 50, selectedCategory);
            setProducts(response.data);
            setProductModalOpen(false);
        } catch (error) {
            setProductModalError("Error al eliminar producto");
            console.error(error);
        } finally {
            setProductModalLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{isEdit ? "Editar Orden" : "Nueva Orden"}</h2>
                <Button
                    type="button"
                    size="sm"
                    className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/20 text-white"
                    onPress={onClose}>
                    x
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-3 flex flex-col space-y-4">
                    <ClientSelector client={client} setClient={setClient} clients={clients} onReloadClients={reloadClients} />

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

                    <ProductGrid
                        products={products}
                        productLoading={productLoading}
                        productError={productError}
                        categories={categories}
                        categoriesLoading={categoriesLoading}
                        categoriesError={categoriesError}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        lines={lines}
                        productQuantities={productQuantities}
                        changeProductQuantity={changeProductQuantity}
                        upsertOrderProduct={upsertOrderProduct}
                        openProductModal={openProductModal}
                    />
                </div>

                <div className="md:col-span-2 flex flex-col space-y-4">
                    <OrderLines lines={lines} products={products} removeLine={removeLine} />

                    <div className="mt-100">
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Guardando..." : (isEdit ? "Actualizar" : "Crear")}
                        </Button>
                    </div>

                </div>
            </div>

            <ProductModal
                productModalOpen={productModalOpen}
                setProductModalOpen={setProductModalOpen}
                productModalMode={productModalMode}
                selectedProduct={selectedProduct}
                productForm={productForm}
                setProductForm={setProductForm}
                categories={categories}
                productModalLoading={productModalLoading}
                productModalError={productModalError}
                saveProduct={saveProduct}
                deleteProductHandler={deleteProductHandler}
            />
        </form>
    );
};

export default OrdenForm;

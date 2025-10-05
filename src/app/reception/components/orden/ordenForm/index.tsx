
"use client";


import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button, Divider, Input as HeroInput } from "@heroui/react";
import { createOrder, updateOrder } from "@/app/services/order.service";
import { getProducts, createProduct, updateProduct, deleteProduct, getProductsByCategory } from "@/app/services/products.service";
import { searchClients } from "@/app/services/clients.service";
import { getCategories } from "@/app/services/categories.service";
import { ICategory } from "@/app/types/categories.type";
import { IClient } from "@/app/types/clients.type";
import { useToast } from "@/utils/toast";
import { IOrder } from "../../../../types/orders.type";
import { IProduct } from "../../../../types/products.type";
import IconButton from "@/app/components/iconButton";
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
    phone: string;
    address: string;
}

const OrdenForm = forwardRef(({ orden, isEdit, onSave, onClose }: OrdenFormProps, ref) => {
    const { showToast } = useToast();
    const [client, setClient] = useState<number>(orden?.client ? Number(orden.client) : 0);
    const [deliveryTime, setDeliveryTime] = useState<string>(() => {
        if (orden?.deliveryTime) {
            const date = new Date(orden.deliveryTime);
            return date.toTimeString().slice(0, 5);
        }
        const now = new Date();
        now.setMinutes(now.getMinutes() + 30);
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Buenos_Aires',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        return formatter.format(now);
    });
    const [paymentMethod, setPaymentMethod] = useState<string>(orden?.paymentMethod || "cash");
    const [lines, setLines] = useState<IOrderLine[]>([]);
    const [clients, setClients] = useState<IClient[]>([]);
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState<string>(orden?.phone || "");
    const [address, setAddress] = useState<string>(orden?.address || "");
    const [total, setTotal] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState<{ [key: number]: IProduct }>({});


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


    useEffect(() => {
        const calculateTotal = () => {
            return lines.reduce((sum, line) => {
                const prod = selectedProducts[line.product] || products.find(p => p.id === line.product);
                return sum + (prod ? prod.price * line.quantity : 0);
            }, 0);
        };
        setTotal(calculateTotal());
    }, [lines, products, selectedProducts]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validations
        if (!client || client === 0) {
            showToast("Debe seleccionar un cliente", "error");
            return;
        }
        if (lines.length === 0) {
            showToast("Debe agregar al menos un producto", "error");
            return;
        }
        if (!paymentMethod) {
            showToast("Debe seleccionar un método de pago", "error");
            return;
        }

        setLoading(true);

        const payload: IOrderPayload = {
            client,
            deliveryTime: new Date(`${new Date().toISOString().split('T')[0]}T${deliveryTime}:00`).toISOString(),
            paymentMethod,
            lines,
            phone,
            address,
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
        setProductQuantities(prev => {
            const newQuantity = Math.max(0, (prev[productId] || 0) + delta);
            if (newQuantity > 0) {
                const product = products.find(p => p.id === productId);
                if (product) {
                    setSelectedProducts(prevSel => ({ ...prevSel, [productId]: product }));
                    const existingIndex = lines.findIndex(line => line.product === productId);
                    if (existingIndex >= 0) {
                        updateLine(existingIndex, 'quantity', newQuantity);
                    } else {
                        setLines([...lines, { product: productId, quantity: newQuantity, personalizations: [] }]);
                    }
                }
            } else {
                setLines(lines.filter(line => line.product !== productId));
            }
            return {
                ...prev,
                [productId]: newQuantity
            };
        });
    };


    // Función para abrir modal de producto
    const openProductModal = (mode: 'create' | 'edit', product?: IProduct) => {
        setProductModalMode(mode);
        if (mode === 'edit' && product) {
            setSelectedProduct(product);
            setProductForm({
                name: product.name,
                price: product.price,
                category: categories.find(c => c.name === product.category)?.id || 1,
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

    useImperativeHandle(ref, () => ({
        submitForm: handleSubmit
    }));

    return (
        <form onSubmit={handleSubmit} className="p-2 md:p-6 space-y-2 md:space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4">
                <div className="md:col-span-3 flex flex-col space-y-2 md:space-y-4">
                    <ClientSelector
                        client={client}
                        setClient={setClient}
                        clients={clients}
                        onReloadClients={reloadClients}
                        setPhone={setPhone}
                        setAddress={setAddress} />

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-3">
                            <HeroInput value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Teléfono" />
                        </div>
                        <HeroInput value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección" />
                    </div>

                    <HeroInput
                        label="Hora de entrega"
                        type="time"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        required
                    />

                    <div className="flex flex-col gap-2">
                        <span className="font-black">¿Donde?</span>
                        <div className="flex justify-between">
                            <IconButton nombre={"Whatsapp"} icon={"whatsapp-solid-dark"} />
                            <IconButton nombre={"Instagram"} icon={"instagram-solid-dark"} />
                            <IconButton nombre={"Facebook"} icon={"facebook-solid-dark"} />
                            <IconButton nombre={"Otro"} icon={"share-solid-dark"} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="font-black">¿Cómo?</span>
                        <div className="flex justify-between">
                            <IconButton nombre="Efectivo" icon="efectivo-solid-dark" onPress={() => setPaymentMethod('cash')} selected={paymentMethod === 'cash'} />
                            <IconButton nombre="Tarjeta" icon="creditCard-solid-dark" onPress={() => setPaymentMethod('card')} selected={paymentMethod === 'card'} />
                            <IconButton nombre="Transferencia" icon="transference-outline-dark" onPress={() => setPaymentMethod('transfer')} selected={paymentMethod === 'transfer'} />
                        </div>
                    </div>

                    <ProductGrid
                        products={products}
                        productLoading={productLoading}
                        productError={productError}
                        categories={categories}
                        categoriesLoading={categoriesLoading}
                        categoriesError={categoriesError}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        productQuantities={productQuantities}
                        changeProductQuantity={changeProductQuantity}
                        openProductModal={openProductModal}
                    />
                </div>

                <div className="md:col-span-2 flex flex-col space-y-2 md:space-y-4">
                    <OrderLines lines={lines} products={products} selectedProducts={selectedProducts} removeLine={removeLine} />

                    <Divider />
                    <div className="flex justify-end mb-4">
                        <h3 className="font-black text-lg">${total.toFixed(2)}</h3>
                    </div>

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
});

OrdenForm.displayName = 'OrdenForm';

export default OrdenForm;

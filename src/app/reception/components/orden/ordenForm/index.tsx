
"use client";


import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button, Divider } from "@heroui/react";
import { createOrder, updateOrder, getOrderById, getClientById } from "@/app/services/order.service";
import { getProducts, getProductsByCategory, getProductById } from "@/app/services/products.service";
import { searchClients } from "@/app/services/clients.service";
import { getCategories } from "@/app/services/categories.service";
import { ICategory } from "@/app/types/categories.type";
import { IClient } from "@/app/types/clients.type";
import { useToast } from "@/utils/toast";
import { IOrder, IOrderPayload, IOrderUpdatePayload, IOrderLinePayload, IOrderUpdateLinePayload } from "../../../../types/orders.type";
import { IProduct } from "../../../../types/products.type";
import IconButton from "@/app/components/iconButton";
import ClientSelector from "./ClientSelector";
import ProductGrid from "./ProductGrid";
import OrderLines from "./OrderLines";

interface OrdenFormProps {
    orden: IOrder | null;
    isEdit: boolean;
    onSave?: (order: IOrder) => void;
    onClose?: () => void;
}

interface IOrderLine {
    product: string;
    quantity: number;
}

const OrdenForm = forwardRef(({ orden, isEdit, onSave, onClose }: OrdenFormProps, ref) => {
    const { showToast } = useToast();
    const [client, setClient] = useState<number>(orden?.client ? Number(orden.client) : 0);
    const [clientModalOpen, setClientModalOpen] = useState<boolean>(!orden && !isEdit);
    const [clientName, setClientName] = useState<string>("");
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
    const [contactMethod, setContactMethod] = useState<string>("whatsapp");
    const [paymentMethod, setPaymentMethod] = useState<string>("cash");
    const [lines, setLines] = useState<IOrderLine[]>([]);
    const [clients, setClients] = useState<IClient[]>([]);
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [total, setTotal] = useState(0);
    const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: IProduct }>({});

    // Estados para grilla de productos
    const [products, setProducts] = useState<IProduct[]>([]);
    const [productQuantities, setProductQuantities] = useState<{ [key: string]: number }>({});
    const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
    const [productLoading, setProductLoading] = useState(false);
    const [productError, setProductError] = useState<string | null>(null);

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

    // Load order details when editing
    useEffect(() => {
        if (isEdit && orden?.id) {
            getOrderById(orden.id)
                .then((details) => {
                    // Populate form with existing data
                    setClient(Number(details.client));
                    setPhone(details.phoneNumber);
                    setAddress(details.address);
                    setPaymentMethod(details.paymentMethod);
                    setContactMethod("whatsapp"); // Default, could be enhanced
                    setClientName(details.client); // Set client name from order details

                    // Update delivery time from order details
                    if (details.deliveryTime) {
                        const date = new Date(details.deliveryTime);
                        setDeliveryTime(date.toTimeString().slice(0, 5));
                    }

                    // Load client details to get the actual client name
                    getClientById(Number(details.client))
                        .then((clientData: { data: IClient }) => {
                            setClientName(clientData.data.name); // Update with actual client name
                        })
                        .catch(console.error);

                    // Convert order lines to form lines
                    const formLines: IOrderLine[] = details.lines.map(line => ({
                        product: line.product.id,
                        quantity: parseInt(line.quantity)
                    }));
                    setLines(formLines);

                    // Set product quantities
                    const quantities: { [key: string]: number } = {};
                    const selectedProds: { [key: string]: IProduct } = {};
                    details.lines.forEach(line => {
                        quantities[line.product.id] = parseInt(line.quantity);
                        // Create a minimal product object for display
                        selectedProds[line.product.id] = {
                            id: line.product.id,
                            name: line.product.name,
                            price: (line.totalPrice / parseInt(line.quantity)).toString(),
                            preTaxPrice: (line.totalPrice / parseInt(line.quantity)).toString(),
                            category: '',
                            ingredients: [],
                            cost: "0", // Default or fetch actual cost if available
                            maxPrepareable: "0" // Default or fetch actual value if available
                        };
                    });
                    setProductQuantities(quantities);
                    setSelectedProducts(selectedProds);
                })
                .catch(console.error);
        }
    }, [isEdit, orden?.id]);

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
                // console.log("Loaded products:", data);
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
                return sum + (prod ? parseFloat(prod.price) * line.quantity : 0);
            }, 0);
        };
        setTotal(calculateTotal());
    }, [lines, products, selectedProducts]);

    const submitOrder = async () => {
        // Validations - relaxed for editing mode
        if (isEdit) {
            // In edit mode, allow some fields to be empty
            if (lines.length === 0) {
                showToast("Debe agregar al menos un producto", "error");
                return;
            }
        } else {
            // Strict validation for new orders
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
        }

        // setLoading(true);

        const orderLines: IOrderLinePayload[] = lines.map(line => ({
            product: {
                id: parseInt(line.product),
                name: selectedProducts[line.product]?.name || products.find(p => p.id === line.product)?.name || ''
            },
            quantity: line.quantity
        }));

        const payload: IOrderPayload = {
            client,
            deliveryTime: new Date(`${new Date().toISOString().split('T')[0]}T${deliveryTime}:00`).toISOString(),
            contactMethod,
            paymentMethod,
            lines: orderLines,
        };

        try {
            let result;
            if (isEdit && orden) {
                const updateLines: IOrderUpdateLinePayload[] = lines.map(line => ({
                    id: parseInt(line.product), // This might need adjustment based on actual line IDs
                    product: {
                        id: parseInt(line.product),
                        name: selectedProducts[line.product]?.name || products.find(p => p.id === line.product)?.name || ''
                    },
                    quantity: line.quantity
                }));

                const updatePayload: IOrderUpdatePayload = {
                    client,
                    deliveryTime: new Date(`${new Date().toISOString().split('T')[0]}T${deliveryTime}:00`).toISOString(),
                    contactMethod,
                    paymentMethod,
                    lines: updateLines,
                };

                result = await updateOrder(orden.id, updatePayload);
                showToast("Orden actualizada exitosamente", "success");
            } else {
                result = await createOrder(payload);
                showToast("Orden creada exitosamente", "success");
            }
            onSave?.(result);
        } catch (error) {
            console.error("Error saving order:", error);
        } finally {
            // setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitOrder();
    };

    // Función addLine removida ya que ahora se agregan productos desde la grilla

    const updateLine = (index: number, field: keyof IOrderLine, value: number | string | unknown[]) => {
        const newLines = [...lines];
        (newLines[index] as Record<keyof IOrderLine, number | string | unknown[]>)[field] = value;
        setLines(newLines);
    };

    const removeLine = (index: number) => {
        setLines(lines.filter((_, i) => i !== index));
    };


    // Función para cambiar cantidad de producto
    const changeProductQuantity = (productId: string, delta: number) => {
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
                        setLines([...lines, { product: productId, quantity: newQuantity }]);
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

    useImperativeHandle(ref, () => ({
        submitForm: submitOrder
    }));

    return (
        <form onSubmit={handleSubmit} className="p-2  space-y-2 md:space-y-4 h-full min-h-0 ">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl text-primary font-black">{isEdit ? "Editar Orden" : "Nueva Orden"}</h2>
                <Button
                    type="button"
                    size="sm"
                    className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/20 text-white"
                    onPress={onClose}>
                    x
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 flex-1 overflow-y-hidden min-h-0 max-h-full">
                <div className="md:col-span-3 flex flex-col space-y-2 md:space-y-2">
                    <ClientSelector
                        client={client}
                        setClient={setClient}
                        clients={clients}
                        onReloadClients={reloadClients}
                        setPhone={setPhone}
                        setAddress={setAddress}
                        clientModalOpen={clientModalOpen}
                        setClientModalOpen={setClientModalOpen}
                        clientName={clientName}
                        setClientName={setClientName} />

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Teléfono"
                                className="flex-1 rounded-md px-3 py-2 text-xs bg-black/10 focus:outline-none"
                            />
                        </div>

                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Dirección"
                            className="flex-1 rounded-md px-3 py-2 text-xs bg-black/10 focus:outline-none"
                        />
                    </div>


                    {/* <HeroInput
                        label="Hora de entrega"
                        type="time"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        required
                    /> */}

                    <div className="flex flex-col bg-black/10 rounded-lg px-2 py-1">
                        <label htmlFor="horaEntrega" className="text-xs font-light text-black/60 ">
                            Hora de entrega
                        </label>
                        <input
                            id="horaEntrega"
                            type="time"
                            value={deliveryTime}
                            onChange={(e) => setDeliveryTime(e.target.value)}
                            required
                            className="rounded-md px-2 py-1 text-xs focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="font-black">¿Donde?</span>
                        <div className="flex justify-between px-1">
                            <IconButton icon={"whatsapp-solid-dark"} onPress={() => setContactMethod('whatsapp')} selected={contactMethod === 'whatsapp'} />
                            <IconButton icon={"instagram-solid-dark"} onPress={() => setContactMethod('Instagram')} selected={contactMethod === 'Instagram'} />
                            <IconButton icon={"facebook-solid-dark"} onPress={() => setContactMethod('Facebook')} selected={contactMethod === 'Facebook'} />
                            <IconButton icon={"share-solid-dark"} onPress={() => setContactMethod('Other')} selected={contactMethod === 'Other'} />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="font-black">¿Cómo?</span>
                        <div className="flex justify-between px-1">
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
                    />
                </div>

                <div className="md:col-span-2 flex flex-col space-y-2 md:space-y-4">
                    <OrderLines lines={lines} products={products} selectedProducts={selectedProducts} removeLine={removeLine} />

                    <Divider />
                    <div className="flex justify-end mb-4">
                        <h3 className="font-black text-lg">${total.toFixed(2)}</h3>
                    </div>

                </div>
            </div>
        </form>
    );
});

OrdenForm.displayName = 'OrdenForm';

export default OrdenForm;


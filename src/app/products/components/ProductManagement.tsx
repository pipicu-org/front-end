"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardBody, CardHeader, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../services/products.service";
import { getCategories } from "../../services/categories.service";
import { getIngredients } from "../../services/ingredients.service";
import { IProduct, IProductPayload } from "../../types/products.type";
import ProductForm from "./ProductForm";
import ToggleView from "./ToggleView";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

const ProductManagement = () => {
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [view, setView] = useState<"table" | "cards">("table");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Detect mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Force cards on mobile
    useEffect(() => {
        if (isMobile) setView("cards");
    }, [isMobile]);

    const queryClient = useQueryClient();

    // Queries
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const { data: ingredientsData } = useQuery({
        queryKey: ["ingredients"],
        queryFn: () => getIngredients("", 1, 100),
    });

    const { data: productsData, isLoading, error } = useQuery({
        queryKey: ["products", page, limit, selectedCategory, search],
        queryFn: () => getProducts(page, limit, selectedCategory !== "all" ? parseInt(selectedCategory) : undefined),
    });

    const products = productsData?.data || [];
    const total = productsData?.total || 0;

    // Mutations
    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            onClose();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<IProductPayload> }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            onClose();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    const handleCreate = () => {
        setEditingProduct(null);
        onOpen();
    };

    const handleEdit = (product: IProduct) => {
        setEditingProduct(product);
        onOpen();
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            deleteMutation.mutate(id);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const observerRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (!node) return;
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && page < Math.ceil(total / limit)) {
                        setPage(prev => prev + 1);
                    }
                },
                { threshold: 1.0 }
            );
            observer.observe(node);
            return () => observer.disconnect();
        },
        [page, total, limit]
    );

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold">Productos</h2>
                <div className="flex items-center gap-2">
                    {!isMobile && <ToggleView view={view} onToggle={() => setView(view === "table" ? "cards" : "table")} />}
                    <Button color="primary" onPress={handleCreate}>
                        Nuevo Producto
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Buscar productos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="md:w-1/3"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border rounded-md md:w-1/3"
                >
                    <option value="all">Todas las categorías</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id.toString()}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <EmptyState message="Error al cargar productos" />
                ) : filteredProducts.length === 0 ? (
                    <EmptyState message="No hay productos disponibles" />
                ) : view === "table" ? (
                    <div className="h-full flex flex-col">
                        <Table aria-label="Tabla de Productos" className="flex-1" isStriped>
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>Nombre</TableColumn>
                                <TableColumn>Precio</TableColumn>
                                <TableColumn>Categoría</TableColumn>
                                <TableColumn>Acciones</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell>${product.price}</TableCell>
                                        <TableCell>{categories.find(c => c.id === parseInt(product.category))?.name || "N/A"}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button size="sm" onPress={() => handleEdit(product)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" color="danger" onPress={() => handleDelete(product.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                    </svg>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {total > limit && (
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    total={Math.ceil(total / limit)}
                                    page={page}
                                    onChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <h4 className="font-semibold">{product.name}</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <p>Precio: ${product.price}</p>
                                            <p>Categoría: {categories.find(c => c.id === parseInt(product.category))?.name || "N/A"}</p>
                                            <p>Receta: {product.ingredients?.map(ing => `${ing.quantity} x Ingrediente ${ing.id}`).join(", ") || "Sin receta"}</p>
                                            <div className="flex space-x-2 mt-4">
                                                <Button size="sm" onPress={() => handleEdit(product)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" color="danger" onPress={() => handleDelete(product.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                    </svg>
                                                </Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                            {page < Math.ceil(total / limit) && (
                                <div ref={observerRef} className="col-span-full flex items-center justify-center py-4">
                                    <Loader message="Cargando más productos..." />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Product Modal */}
            <ProductForm
                isOpen={isOpen}
                onClose={onClose}
                editingProduct={editingProduct}
                categories={categories}
                ingredients={ingredientsData?.data || []}
                onSave={(data) => {
                    if (editingProduct) {
                        updateMutation.mutate({ id: editingProduct.id, data });
                    } else {
                        createMutation.mutate(data);
                    }
                }}
            />
        </div>
    );
};

export default ProductManagement;
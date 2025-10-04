"use client";

import { useState, useCallback } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardBody, CardHeader, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { getProductsByCategory, createProduct, updateProduct, deleteProduct } from "../../services/products.service";
import { getCategories } from "../../services/categories.service";
import { getIngredients } from "../../services/ingredients.service";
import { IProduct, IProductPayload } from "../../types/products.type";
import { ICategory } from "../../types/categories.type";
import ProductForm from "./ProductForm";

const ProductManagement = () => {
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const queryClient = useQueryClient();

    // Queries
    const { data: categories = [] } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });

    const { data: ingredientsData } = useQuery({
        queryKey: ["ingredients"],
        queryFn: () => getIngredients("", 1, 100), // Get all ingredients
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            onClose();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<IProductPayload> }) => updateProduct(id, data),
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

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de eliminar este producto?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Productos</h2>
                <Button color="primary" onPress={handleCreate}>
                    Nuevo Producto
                </Button>
            </div>

            {/* Categories with Products */}
            {categories.map((category) => (
                <CategorySection
                    key={category.id}
                    category={category}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}

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

const CategorySection = ({ category, onEdit, onDelete }: { category: ICategory; onEdit: (product: IProduct) => void; onDelete: (id: number) => void }) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ["products", category.id],
        queryFn: ({ pageParam = 1 }) => getProductsByCategory(category.id, pageParam, 10),
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.data.length < 10) return undefined;
            return pages.length + 1;
        },
        initialPageParam: 1,
    });

    const observerRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (!node) return;
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                },
                { threshold: 1.0 }
            );
            observer.observe(node);
            return () => observer.disconnect();
        },
        [fetchNextPage, hasNextPage, isFetchingNextPage]
    );

    if (isLoading) return <div>Cargando productos...</div>;

    const products = data?.pages?.flatMap(page => page.data) || [];

    return (
        <div>
            <h3 className="text-lg font-medium mb-4">{category.name}</h3>
            <div className="flex space-x-4 overflow-x-auto pb-4">
                {products.map((product) => (
                    <motion.div
                        key={product.id}
                        whileHover={{ scale: 1.05 }}
                        className="flex-shrink-0 w-64"
                    >
                        <Card>
                            <CardHeader>
                                <h4 className="font-semibold">{product.name}</h4>
                            </CardHeader>
                            <CardBody>
                                <p>Precio: ${product.price}</p>
                                <p>Receta: {product.ingredients?.map(ing => `${ing.quantity} x Ingrediente ${ing.id}`).join(", ") || "Sin receta"}</p>
                                <div className="flex space-x-2 mt-4">
                                    <Button size="sm" onPress={() => onEdit(product)}>
                                        Editar
                                    </Button>
                                    <Button size="sm" color="danger" onPress={() => onDelete(product.id)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
                {hasNextPage && (
                    <div ref={observerRef} className="flex-shrink-0 w-64 flex items-center justify-center">
                        {isFetchingNextPage ? "Cargando..." : "Cargar más"}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
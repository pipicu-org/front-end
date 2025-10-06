"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardBody, CardHeader, Input, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from "../../services/ingredients.service";
import { IIngredient, IIngredientPayload } from "../../types/ingredients.type";
import IngredientForm from "./IngredientForm";

const IngredientManagement = () => {
    const [search, setSearch] = useState("");
    const [editingIngredient, setEditingIngredient] = useState<IIngredient | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const queryClient = useQueryClient();

    // Queries
    const { data: ingredientsData } = useQuery({
        queryKey: ["ingredients", search],
        queryFn: () => getIngredients(search, 1, 20),
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createIngredient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
            onClose();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<IIngredientPayload> }) => updateIngredient(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
            onClose();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteIngredient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
    });

    const handleCreate = () => {
        setEditingIngredient(null);
        onOpen();
    };

    const handleEdit = (ingredient: IIngredient) => {
        setEditingIngredient(ingredient);
        onOpen();
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de eliminar este ingrediente?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Ingredientes</h2>
                <Button color="primary" onPress={handleCreate}>
                    Nuevo Ingrediente
                </Button>
            </div>

            {/* Search */}
            <Input
                placeholder="Buscar ingredientes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />

            {/* Ingredients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ingredientsData?.data.map((ingredient) => (
                    <motion.div
                        key={ingredient.id}
                        whileHover={{ scale: 1.05 }}
                    >
                        <Card>
                            <CardHeader>
                                <h4 className="font-semibold">{ingredient.name}</h4>
                            </CardHeader>
                            <CardBody>
                                <p>Precio: ${ingredient.price}</p>
                                <div className="flex space-x-2 mt-4">
                                    <Button size="sm" onPress={() => handleEdit(ingredient)}>
                                        Editar
                                    </Button>
                                    <Button size="sm" color="danger" onPress={() => handleDelete(ingredient.id)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Ingredient Modal */}
            <IngredientForm
                isOpen={isOpen}
                onClose={onClose}
                editingIngredient={editingIngredient}
                onSave={(data) => {
                    if (editingIngredient) {
                        updateMutation.mutate({ id: editingIngredient.id, data });
                    } else {
                        createMutation.mutate(data);
                    }
                }}
            />
        </div>
    );
};

export default IngredientManagement;
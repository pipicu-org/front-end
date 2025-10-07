"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { motion } from "framer-motion";
import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from "../../services/ingredients.service";
import { IIngredient, IIngredientPayload } from "../../types/ingredients.type";
import IngredientForm from "./IngredientForm";

const IngredientManagement = () => {
    const [search, setSearch] = useState("");
    const [editingIngredient, setEditingIngredient] = useState<IIngredient | null>(null);
    const [ingredientToDelete, setIngredientToDelete] = useState<IIngredient | null>(null);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

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
        mutationFn: ({ id, data }: { id: string; data: Partial<IIngredientPayload> }) => updateIngredient(id, data),
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

    const handleDelete = (ingredient: IIngredient) => {
        setIngredientToDelete(ingredient);
        setDeleteConfirmationText("");
        onDeleteOpen();
    };

    const handleConfirmDelete = () => {
        if (ingredientToDelete && deleteConfirmationText === "eliminar") {
            deleteMutation.mutate(ingredientToDelete.id);
            onDeleteClose();
            setIngredientToDelete(null);
            setDeleteConfirmationText("");
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

            {/* Ingredients Table */}
            <Table aria-label="Tabla de Ingredientes">
                <TableHeader>
                    <TableColumn>ID</TableColumn>
                    <TableColumn>Nombre</TableColumn>
                    <TableColumn>Unidad ID</TableColumn>
                    <TableColumn>Factor de Pérdida</TableColumn>
                    <TableColumn>Creado</TableColumn>
                    <TableColumn>Actualizado</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody emptyContent={"No hay ingredientes"}>
                    {(ingredientsData?.data || []).map((ingredient) => (
                        <TableRow key={ingredient.id}>
                            <TableCell>{ingredient.id}</TableCell>
                            <TableCell>{ingredient.name}</TableCell>
                            <TableCell>{ingredient.unitId}</TableCell>
                            <TableCell>{ingredient.lossFactor}</TableCell>
                            <TableCell>{new Date(ingredient.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(ingredient.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button size="sm" onPress={() => handleEdit(ingredient)}>
                                        Editar
                                    </Button>
                                    <Button size="sm" color="danger" onPress={() => handleDelete(ingredient)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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

            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalContent>
                    <ModalHeader>
                        Confirmar Eliminación
                    </ModalHeader>
                    <ModalBody>
                        <p>¿Estás seguro de que deseas eliminar el ingrediente <strong>{ingredientToDelete?.name}</strong>?</p>
                        <p>Esta acción no se puede deshacer.</p>
                        <input
                            type="text"
                            placeholder="Escribe 'eliminar' para confirmar"
                            value={deleteConfirmationText}
                            onChange={(e) => setDeleteConfirmationText(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onDeleteClose}>
                            Cancelar
                        </Button>
                        <Button color="danger" onPress={handleConfirmDelete} isDisabled={deleteConfirmationText !== "eliminar"}>
                            Eliminar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default IngredientManagement;
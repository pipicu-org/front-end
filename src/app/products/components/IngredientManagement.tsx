"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import { getIngredients, createIngredient, updateIngredient, deleteIngredient } from "../../services/ingredients.service";
import { IIngredient, IIngredientPayload } from "../../types/ingredients.type";
import IngredientForm from "./IngredientForm";
import ToggleView from "./ToggleView";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

const IngredientManagement = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [view, setView] = useState<"table" | "cards">("table");
    const [editingIngredient, setEditingIngredient] = useState<IIngredient | null>(null);
    const [ingredientToDelete, setIngredientToDelete] = useState<IIngredient | null>(null);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

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
    const { data: ingredientsData, isLoading, error } = useQuery({
        queryKey: ["ingredients", search, page, limit],
        queryFn: () => getIngredients(search, page, limit),
    });

    const ingredients = ingredientsData?.data || [];
    const total = ingredientsData?.total || 0;

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
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold">Ingredientes</h2>
                <div className="flex items-center gap-2">
                    {!isMobile && <ToggleView view={view} onToggle={() => setView(view === "table" ? "cards" : "table")} />}
                    <Button color="primary" onPress={handleCreate}>
                        Nuevo Ingrediente
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Input
                placeholder="Buscar ingredientes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-md"
            />

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <EmptyState message="Error al cargar ingredientes" />
                ) : ingredients.length === 0 ? (
                    <EmptyState message="No hay ingredientes disponibles" />
                ) : view === "table" ? (
                    <div className="h-full flex flex-col">
                        <Table aria-label="Tabla de Ingredientes" className="flex-1" isStriped>
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>Nombre</TableColumn>
                                <TableColumn>Unidad ID</TableColumn>
                                <TableColumn>Stock</TableColumn>
                                <TableColumn>Factor de Pérdida</TableColumn>
                                <TableColumn>Creado</TableColumn>
                                <TableColumn>Actualizado</TableColumn>
                                <TableColumn>Acciones</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {ingredients.map((ingredient) => (
                                    <TableRow key={ingredient.id}>
                                        <TableCell>{ingredient.id}</TableCell>
                                        <TableCell>{ingredient.name}</TableCell>
                                        <TableCell>{ingredient.unitId}</TableCell>
                                        <TableCell>{ingredient.stock}</TableCell>
                                        <TableCell>{ingredient.lossFactor}</TableCell>
                                        <TableCell>{new Date(ingredient.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(ingredient.updatedAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button size="sm" onPress={() => handleEdit(ingredient)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" color="danger" onPress={() => handleDelete(ingredient)}>
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
                            {ingredients.map((ingredient) => (
                                <motion.div
                                    key={ingredient.id}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <h4 className="font-semibold">{ingredient.name}</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <p>Unidad ID: {ingredient.unitId}</p>
                                            <p>Factor de Pérdida: {ingredient.lossFactor}</p>
                                            <p>Creado: {new Date(ingredient.createdAt).toLocaleDateString()}</p>
                                            <p>Actualizado: {new Date(ingredient.updatedAt).toLocaleDateString()}</p>
                                            <div className="flex space-x-2 mt-4">
                                                <Button size="sm" onPress={() => handleEdit(ingredient)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" color="danger" onPress={() => handleDelete(ingredient)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                    </svg>
                                                </Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
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

            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalContent>
                    <ModalHeader>
                        Confirmar Eliminación
                    </ModalHeader>
                    <ModalBody>
                        <p>¿Estás seguro de que deseas eliminar el ingrediente <strong>{ingredientToDelete?.name}</strong>?</p>
                        <p>Esta acción no se puede deshacer.</p>
                        <Input
                            label="Escribe 'eliminar' para confirmar"
                            value={deleteConfirmationText}
                            onChange={(e) => setDeleteConfirmationText(e.target.value)}
                            placeholder="eliminar"
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
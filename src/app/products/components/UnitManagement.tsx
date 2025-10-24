"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Input, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import { getUnits, createUnit, updateUnit, deleteUnit } from "../../services/units.service";
import { IUnit, IUnitPayload } from "../../types/units.type";
import UnitForm from "./UnitForm";
import ToggleView from "./ToggleView";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

const UnitManagement = () => {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [view, setView] = useState<"table" | "cards">("table");
    const [editingUnit, setEditingUnit] = useState<IUnit | null>(null);
    const [unitToDelete, setUnitToDelete] = useState<IUnit | null>(null);
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
    const { data: unitsData, isLoading, error } = useQuery({
        queryKey: ["units", search, page, limit],
        queryFn: () => getUnits(),
    });

    const units = unitsData || [];

    // Mutations
    const createMutation = useMutation({
        mutationFn: createUnit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
            onClose();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<IUnitPayload> }) => updateUnit(id.toString(), data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
            onClose();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUnit,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["units"] });
        },
    });

    const handleCreate = () => {
        setEditingUnit(null);
        onOpen();
    };

    const handleEdit = (unit: IUnit) => {
        setEditingUnit(unit);
        onOpen();
    };

    const handleDelete = (unit: IUnit) => {
        setUnitToDelete(unit);
        setDeleteConfirmationText("");
        onDeleteOpen();
    };

    const handleConfirmDelete = () => {
        if (unitToDelete && deleteConfirmationText === "eliminar") {
            deleteMutation.mutate(unitToDelete.id.toString());
            onDeleteClose();
            setUnitToDelete(null);
            setDeleteConfirmationText("");
        }
    };

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold">Unidades</h2>
            </div>

            {/* Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Input
                    placeholder="Buscar unidades..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                    classNames={{ inputWrapper: "bg-gray-500/20", input: "text-black placeholder:text-black" }}
                />
                <div className="flex items-center gap-2">
                    {!isMobile && <ToggleView view={view} onToggle={() => setView(view === "table" ? "cards" : "table")} />}
                    <Button color="primary" onPress={handleCreate}>
                        Nueva Unidad
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <Loader />
                ) : error ? (
                    <EmptyState message="Error al cargar unidades" />
                ) : units.length === 0 ? (
                    <EmptyState message="No hay unidades disponibles" />
                ) : view === "table" ? (
                    <div className="h-full flex flex-col">
                        <Table aria-label="Tabla de Unidades" className="flex-1 text-lg" isStriped>
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>Nombre</TableColumn>
                                <TableColumn>Factor</TableColumn>
                                <TableColumn>Creado</TableColumn>
                                <TableColumn>Actualizado</TableColumn>
                                <TableColumn>Acciones</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {units.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell>{unit.id}</TableCell>
                                        <TableCell>{unit.name}</TableCell>
                                        <TableCell>{unit.factor}</TableCell>
                                        <TableCell>{new Date(unit.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</TableCell>
                                        <TableCell>{new Date(unit.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center space-x-1">
                                                <Button size="sm" variant="light" onPress={() => handleEdit(unit)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" variant="light" color="danger" onPress={() => handleDelete(unit)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                                                    </svg>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {units.length > limit && (
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    total={Math.ceil(units.length / limit)}
                                    page={page}
                                    onChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {units.map((unit) => (
                                <motion.div
                                    key={unit.id}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <h4 className="font-semibold">{unit.name}</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <p>Factor: {unit.factor}</p>
                                            <p>Creado: {new Date(unit.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</p>
                                            <p>Actualizado: {new Date(unit.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</p>
                                            <div className="flex justify-center space-x-1 mt-4">
                                                <Button size="sm" variant="light" onPress={() => handleEdit(unit)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" variant="light" color="danger" onPress={() => handleDelete(unit)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
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

            {/* Unit Modal */}
            <UnitForm
                isOpen={isOpen}
                onClose={onClose}
                editingUnit={editingUnit}
                onSave={(data) => {
                    if (editingUnit) {
                        updateMutation.mutate({ id: editingUnit.id, data });
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
                        <p>¿Estás seguro de que deseas eliminar la unidad <strong>{unitToDelete?.name}</strong>?</p>
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

export default UnitManagement;
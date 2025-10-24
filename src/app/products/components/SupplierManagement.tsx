"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Card, CardBody, CardHeader } from "@heroui/react";
import { motion } from "framer-motion";
import { ISupplier, ISupplierPayload } from "../../types/suppliers.type";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../services/suppliers.service";
import ToggleView from "./ToggleView";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

const SupplierManagement = () => {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [sort, setSort] = useState<string>("name");
    const [view, setView] = useState<"table" | "cards">("table");
    const [editingSupplier, setEditingSupplier] = useState<ISupplier | null>(null);
    const [formData, setFormData] = useState<ISupplierPayload>({ name: "", description: "" });
    const [formErrors, setFormErrors] = useState<{ name?: string; description?: string }>({});
    const [supplierToDelete, setSupplierToDelete] = useState<ISupplier | null>(null);
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

    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getSuppliers(page, limit, search, sort);
            setSuppliers(response.data);
            setTotal(response.total);
        } catch {
            setError("Error al cargar proveedores");
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, sort]);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleSort = (newSort: string) => {
        setSort(newSort);
        setPage(1);
    };

    const handleCreate = () => {
        setEditingSupplier(null);
        setFormData({ name: "", description: "" });
        setFormErrors({});
        onOpen();
    };

    const handleEdit = (supplier: ISupplier) => {
        setEditingSupplier(supplier);
        setFormData({ name: supplier.name, description: supplier.description });
        setFormErrors({});
        onOpen();
    };

    const handleDelete = (supplier: ISupplier) => {
        setSupplierToDelete(supplier);
        setDeleteConfirmationText("");
        onDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        if (supplierToDelete && deleteConfirmationText === "eliminar") {
            try {
                await deleteSupplier(supplierToDelete.id);
                fetchSuppliers();
                onDeleteClose();
                setSupplierToDelete(null);
                setDeleteConfirmationText("");
            } catch {
                setError("Error al eliminar proveedor");
            }
        }
    };

    const validateForm = (): boolean => {
        const errors: { name?: string; description?: string } = {};
        if (!formData.name.trim()) errors.name = "Nombre es requerido";
        if (!formData.description.trim()) errors.description = "Descripción es requerida";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            if (editingSupplier) {
                await updateSupplier(editingSupplier.id, formData);
            } else {
                await createSupplier(formData);
            }
            onClose();
            fetchSuppliers();
        } catch {
            setError("Error al guardar proveedor");
        }
    };

    return (
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-semibold">Proveedores</h2>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                    <Input
                        placeholder="Buscar por nombre..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="max-w-md"
                        classNames={{ inputWrapper: "bg-gray-500/20", input: "text-black placeholder:text-black" }}
                    />
                    <select
                        value={sort}
                        onChange={(e) => handleSort(e.target.value)}
                        className="px-3 py-2 border rounded-md md:w-1/3"
                    >
                        <option value="name">Ordenar por Nombre</option>
                        <option value="createdAt">Ordenar por Fecha de Creación</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    {!isMobile && <ToggleView view={view} onToggle={() => setView(view === "table" ? "cards" : "table")} />}
                    <Button color="primary" onPress={handleCreate}>
                        Nuevo Proveedor
                    </Button>
                </div>
            </div>

            {/* Error Alert */}
            {error && (
                <EmptyState message={error} />
            )}

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <Loader />
                ) : suppliers.length === 0 ? (
                    <EmptyState message="No hay proveedores disponibles" />
                ) : view === "table" ? (
                    <div className="h-full flex flex-col">
                        <Table aria-label="Tabla de Proveedores" className="flex-1 text-lg" isStriped>
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>Nombre</TableColumn>
                                <TableColumn>Descripción</TableColumn>
                                <TableColumn>Creado</TableColumn>
                                <TableColumn>Actualizado</TableColumn>
                                <TableColumn>Acciones</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {suppliers.map((supplier) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell>{supplier.id}</TableCell>
                                        <TableCell>{supplier.name}</TableCell>
                                        <TableCell>{supplier.description}</TableCell>
                                        <TableCell>{new Date(supplier.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</TableCell>
                                        <TableCell>{new Date(supplier.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</TableCell>
                                        <TableCell>
                                            <div className="flex justify-center space-x-1">
                                                <Button size="sm" variant="light" onPress={() => handleEdit(supplier)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" variant="light" color="danger" onPress={() => handleDelete(supplier)}>
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
                        {total > limit && (
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    total={Math.ceil(total / limit)}
                                    page={page}
                                    onChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {suppliers.map((supplier) => (
                                <motion.div
                                    key={supplier.id}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <h4 className="font-semibold">{supplier.name}</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <p>{supplier.description}</p>
                                            <p>Creado: {new Date(supplier.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</p>
                                            <p>Actualizado: {new Date(supplier.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace(/ (\w+)/, (match, month) => ' ' + month.charAt(0).toUpperCase() + month.slice(1))}</p>
                                            <div className="flex justify-center space-x-1 mt-4">
                                                <Button size="sm" variant="light" onPress={() => handleEdit(supplier)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" variant="light" color="danger" onPress={() => handleDelete(supplier)}>
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

            {/* Supplier Modal */}
            <Modal isOpen={isOpen} onClose={onClose} backdrop="opaque">
                <ModalContent style={{ background: 'linear-gradient(to right, rgba(242, 220, 230, 1) 0%, rgba(245, 225, 220, 1) 50%, rgba(250, 235, 210, 1) 70%, rgba(255, 240, 205, 1) 90%, rgba(255, 245, 210, 1) 100%)' }}>
                    <ModalHeader>
                        {editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Nombre"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            errorMessage={formErrors.name}
                            isInvalid={!!formErrors.name}
                        />
                        <Input
                            label="Descripción"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            errorMessage={formErrors.description}
                            isInvalid={!!formErrors.description}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button color="primary" onPress={handleSave}>
                            Guardar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalContent>
                    <ModalHeader>
                        Confirmar Eliminación
                    </ModalHeader>
                    <ModalBody>
                        <p>¿Estás seguro de que deseas eliminar el proveedor <strong>{supplierToDelete?.name}</strong>?</p>
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

export default SupplierManagement;
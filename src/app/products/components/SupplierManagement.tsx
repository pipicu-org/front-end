"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Spinner, Alert } from "@heroui/react";
import { ISupplier, ISupplierPayload } from "../../types/suppliers.type";
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from "../../services/suppliers.service";

const SupplierManagement = () => {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [sort, setSort] = useState<string>("name");
    const [editingSupplier, setEditingSupplier] = useState<ISupplier | null>(null);
    const [formData, setFormData] = useState<ISupplierPayload>({ name: "", description: "" });
    const [formErrors, setFormErrors] = useState<{ name?: string; description?: string }>({});
    const [supplierToDelete, setSupplierToDelete] = useState<ISupplier | null>(null);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState<string>("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold">Proveedores</h2>
                <Button color="primary" onPress={handleCreate}>
                    Nuevo Proveedor
                </Button>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4">
                <Input
                    placeholder="Buscar por nombre..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="md:w-1/3"
                />
                <select
                    value={sort}
                    onChange={(e) => handleSort(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                >
                    <option value="name">Ordenar por Nombre</option>
                    <option value="createdAt">Ordenar por Fecha de Creación</option>
                </select>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert color="danger" title="Error" description={error} />
            )}

            {/* Suppliers Table */}
            {loading ? (
                <div className="flex justify-center">
                    <Spinner size="lg" />
                </div>
            ) : (
                <Table aria-label="Tabla de Proveedores">
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
                                <TableCell>{new Date(supplier.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(supplier.updatedAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button size="sm" onPress={() => handleEdit(supplier)}>
                                            Editar
                                        </Button>
                                        <Button size="sm" color="danger" onPress={() => handleDelete(supplier)}>
                                            Eliminar
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Pagination */}
            {total > limit && (
                <div className="flex justify-center">
                    <Pagination
                        total={Math.ceil(total / limit)}
                        page={page}
                        onChange={handlePageChange}
                    />
                </div>
            )}

            {/* Supplier Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
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
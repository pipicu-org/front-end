"use client";

import { useState, useEffect } from "react";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Alert, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { IPurchase } from "../../types/purchases.type";
import { getPurchases, deletePurchase, downloadPurchaseTemplate, uploadPurchaseExcel } from "../../services/purchase.service";
import PurchaseForm from "./PurchaseForm";
import PurchaseDetailModal from "./PurchaseDetailModal";

const PurchaseManagement = () => {
    const [purchases, setPurchases] = useState<IPurchase[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [editingPurchase, setEditingPurchase] = useState<IPurchase | null>(null);
    const [viewingPurchase, setViewingPurchase] = useState<IPurchase | null>(null);
    const [purchaseToDelete, setPurchaseToDelete] = useState<IPurchase | null>(null);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState<string>("");
    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

    const fetchPurchases = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPurchases();
            setPurchases(data);
        } catch {
            setError("Error al cargar compras");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    const handleCreate = () => {
        setEditingPurchase(null);
        onFormOpen();
    };

    const handleEdit = (purchase: IPurchase) => {
        setEditingPurchase(purchase);
        onFormOpen();
    };

    const handleViewDetail = (purchase: IPurchase) => {
        setViewingPurchase(purchase);
        onDetailOpen();
    };

    const handleDelete = (purchase: IPurchase) => {
        setPurchaseToDelete(purchase);
        setDeleteConfirmationText("");
        onDeleteOpen();
    };

    const handleConfirmDelete = async () => {
        if (purchaseToDelete && deleteConfirmationText === "eliminar") {
            try {
                await deletePurchase(purchaseToDelete.id);
                fetchPurchases();
                onDeleteClose();
                setPurchaseToDelete(null);
                setDeleteConfirmationText("");
            } catch {
                setError("Error al eliminar compra");
            }
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const blob = await downloadPurchaseTemplate();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "purchase_template.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch {
            setError("Error al descargar template");
        }
    };

    const handleUploadExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                await uploadPurchaseExcel(file);
                fetchPurchases();
            } catch {
                setError("Error al subir Excel");
            }
        }
    };

    const calculateTotalCost = (purchase: IPurchase): number => {
        return purchase.purchaseItems.reduce((total, item) => total + parseFloat(item.cost) * parseFloat(item.quantity), 0);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold">Compras</h2>
                <div className="flex gap-2">
                    <Button onPress={handleDownloadTemplate} className="hidden">
                        Descargar Template
                    </Button>
                    <label htmlFor="excel-upload" className="cursor-pointer hidden">
                        <Button as="span">
                            Subir Excel
                        </Button>
                    </label>
                    <input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleUploadExcel}
                        className="hidden"
                    />
                    <Button color="primary" onPress={handleCreate}>
                        Nueva Compra
                    </Button>
                </div>
            </div>

            {error && (
                <Alert color="danger" title="Error" description={error} />
            )}

            {loading ? (
                <div className="flex justify-center">
                    <Spinner size="lg" />
                </div>
            ) : (
                <Table aria-label="Tabla de Compras">
                    <TableHeader>
                        <TableColumn>ID</TableColumn>
                        <TableColumn>Proveedor</TableColumn>
                        <TableColumn>Fecha de Creación</TableColumn>
                        <TableColumn>Total Costo</TableColumn>
                        <TableColumn>Acciones</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {purchases.map((purchase) => (
                            <TableRow key={purchase.id}>
                                <TableCell>{purchase.id}</TableCell>
                                <TableCell>{purchase.providerId}</TableCell>
                                <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>${calculateTotalCost(purchase).toFixed(2)}</TableCell>
                                <TableCell>
                                    <div className="flex space-x-2">
                                        <Button size="sm" onPress={() => handleViewDetail(purchase)}>
                                            Ver
                                        </Button>
                                        <Button size="sm" onPress={() => handleEdit(purchase)}>
                                            Editar
                                        </Button>
                                        <Button size="sm" color="danger" onPress={() => handleDelete(purchase)}>
                                            Eliminar
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <PurchaseForm
                isOpen={isFormOpen}
                onClose={onFormClose}
                purchase={editingPurchase}
                onSuccess={fetchPurchases}
            />

            <PurchaseDetailModal
                isOpen={isDetailOpen}
                onClose={onDetailClose}
                purchase={viewingPurchase}
            />

            <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
                <ModalContent>
                    <ModalHeader>
                        Confirmar Eliminación
                    </ModalHeader>
                    <ModalBody>
                        <p>¿Estás seguro de que deseas eliminar la compra <strong>{purchaseToDelete?.id}</strong>?</p>
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

export default PurchaseManagement;
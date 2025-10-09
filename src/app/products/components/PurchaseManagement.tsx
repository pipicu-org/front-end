"use client";

import { useState, useEffect } from "react";
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { motion } from "framer-motion";
import { IPurchase } from "../../types/purchases.type";
import { getPurchases, deletePurchase, downloadPurchaseTemplate, uploadPurchaseExcel } from "../../services/purchase.service";
import PurchaseForm from "./PurchaseForm";
import PurchaseDetailModal from "./PurchaseDetailModal";
import ToggleView from "./ToggleView";
import Loader from "./Loader";
import EmptyState from "./EmptyState";

const PurchaseManagement = () => {
    const [purchases, setPurchases] = useState<IPurchase[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [view, setView] = useState<"table" | "cards">("table");
    const [editingPurchase, setEditingPurchase] = useState<IPurchase | null>(null);
    const [viewingPurchase, setViewingPurchase] = useState<IPurchase | null>(null);
    const [purchaseToDelete, setPurchaseToDelete] = useState<IPurchase | null>(null);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState<string>("");
    const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
    const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
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

    const fetchPurchases = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPurchases();
            setPurchases(data.purchases);
        } catch {
            setError("Error al cargar compras");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    const paginatedPurchases = purchases.slice((page - 1) * limit, page * limit);

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
        <div className="space-y-6 flex flex-col h-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-semibold">Compras</h2>
                <div className="flex items-center gap-2">
                    {!isMobile && <ToggleView view={view} onToggle={() => setView(view === "table" ? "cards" : "table")} />}
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

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {loading ? (
                    <Loader />
                ) : error ? (
                    <EmptyState message={error} />
                ) : purchases.length === 0 ? (
                    <EmptyState message="No hay compras disponibles" />
                ) : view === "table" ? (
                    <div className="h-full flex flex-col">
                        <Table aria-label="Tabla de Compras" className="flex-1" isStriped>
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>Proveedor</TableColumn>
                                <TableColumn>Fecha de Creación</TableColumn>
                                <TableColumn>Total Costo</TableColumn>
                                <TableColumn>Acciones</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {paginatedPurchases.map((purchase) => (
                                    <TableRow key={purchase.id}>
                                        <TableCell>{purchase.id}</TableCell>
                                        <TableCell>{purchase.providerId}</TableCell>
                                        <TableCell>{new Date(purchase.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>${calculateTotalCost(purchase).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button size="sm" onPress={() => handleViewDetail(purchase)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" onPress={() => handleEdit(purchase)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" color="danger" onPress={() => handleDelete(purchase)}>
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
                        {purchases.length > limit && (
                            <div className="flex justify-center mt-4">
                                <Pagination
                                    total={Math.ceil(purchases.length / limit)}
                                    page={page}
                                    onChange={setPage}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {paginatedPurchases.map((purchase) => (
                                <motion.div
                                    key={purchase.id}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card>
                                        <CardHeader>
                                            <h4 className="font-semibold">Compra {purchase.id}</h4>
                                        </CardHeader>
                                        <CardBody>
                                            <p>Proveedor: {purchase.providerId}</p>
                                            <p>Fecha: {new Date(purchase.createdAt).toLocaleDateString()}</p>
                                            <p>Total: ${calculateTotalCost(purchase).toFixed(2)}</p>
                                            <div className="flex space-x-2 mt-4">
                                                <Button size="sm" onPress={() => handleViewDetail(purchase)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" onPress={() => handleEdit(purchase)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 0 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                                    </svg>
                                                </Button>
                                                <Button size="sm" color="danger" onPress={() => handleDelete(purchase)}>
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

export default PurchaseManagement;
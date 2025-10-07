"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { IPurchase } from "../../types/purchases.type";

interface PurchaseDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    purchase: IPurchase | null;
}

const PurchaseDetailModal = ({ isOpen, onClose, purchase }: PurchaseDetailModalProps) => {
    if (!purchase) return null;

    const calculateTotalCost = (): number => {
        return purchase.purchaseItems.reduce((total, item) => total + parseFloat(item.cost) * parseFloat(item.quantity), 0);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalContent>
                <ModalHeader>
                    Detalle de Compra #{purchase.id}
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Proveedor ID:</strong> {purchase.providerId}
                            </div>
                            <div>
                                <strong>Fecha de Creación:</strong> {new Date(purchase.createdAt).toLocaleString()}
                            </div>
                            <div>
                                <strong>Fecha de Actualización:</strong> {new Date(purchase.updatedAt).toLocaleString()}
                            </div>
                            <div>
                                <strong>Total Costo:</strong> ${calculateTotalCost().toFixed(2)}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-2">Items de Compra</h4>
                            <Table aria-label="Items de Compra">
                                <TableHeader>
                                    <TableColumn>ID Ingrediente</TableColumn>
                                    <TableColumn>Costo</TableColumn>
                                    <TableColumn>Cantidad</TableColumn>
                                    <TableColumn>ID Unidad</TableColumn>
                                    <TableColumn>Cantidad Unidad</TableColumn>
                                    <TableColumn>Subtotal</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {purchase.purchaseItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.ingredientId}</TableCell>
                                            <TableCell>${parseFloat(item.cost).toFixed(2)}</TableCell>
                                            <TableCell>{parseFloat(item.quantity)}</TableCell>
                                            <TableCell>{item.unitId}</TableCell>
                                            <TableCell>{parseFloat(item.unitQuantity)}</TableCell>
                                            <TableCell>${(parseFloat(item.cost) * parseFloat(item.quantity)).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onPress={onClose}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PurchaseDetailModal;
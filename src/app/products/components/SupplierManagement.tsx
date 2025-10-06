"use client";

import { useState } from "react";
import { Button, Card, CardBody, CardHeader, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { motion } from "framer-motion";
import { ISupplier, ISupplierPayload } from "../../types/suppliers.type";

const SupplierManagement = () => {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([
        { id: 1, name: "Proveedor 1", contact: "contacto1@example.com" },
        { id: 2, name: "Proveedor 2", contact: "contacto2@example.com" },
    ]);
    const [editingSupplier, setEditingSupplier] = useState<ISupplier | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleCreate = () => {
        setEditingSupplier(null);
        onOpen();
    };

    const handleEdit = (supplier: ISupplier) => {
        setEditingSupplier(supplier);
        onOpen();
    };

    const handleDelete = (id: number) => {
        if (confirm("¿Estás seguro de eliminar este proveedor?")) {
            setSuppliers(suppliers.filter(s => s.id !== id));
        }
    };

    const handleSave = (data: ISupplierPayload) => {
        if (editingSupplier) {
            setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, ...data } : s));
        } else {
            const newId = Math.max(...suppliers.map(s => s.id)) + 1;
            setSuppliers([...suppliers, { id: newId, ...data }]);
        }
        onClose();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Proveedores</h2>
                <Button color="primary" onPress={handleCreate}>
                    Nuevo Proveedor
                </Button>
            </div>

            {/* Suppliers Grid */}
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
                                <p>Contacto: {supplier.contact}</p>
                                <div className="flex space-x-2 mt-4">
                                    <Button size="sm" onPress={() => handleEdit(supplier)}>
                                        Editar
                                    </Button>
                                    <Button size="sm" color="danger" onPress={() => handleDelete(supplier.id)}>
                                        Eliminar
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Supplier Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>
                        {editingSupplier ? "Editar Proveedor" : "Nuevo Proveedor"}
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Nombre"
                            defaultValue={editingSupplier?.name || ""}
                            id="supplier-name"
                        />
                        <Input
                            label="Contacto"
                            defaultValue={editingSupplier?.contact || ""}
                            id="supplier-contact"
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="light" onPress={onClose}>
                            Cancelar
                        </Button>
                        <Button color="primary" onPress={() => {
                            const name = (document.getElementById("supplier-name") as HTMLInputElement)?.value;
                            const contact = (document.getElementById("supplier-contact") as HTMLInputElement)?.value;
                            if (name && contact) {
                                handleSave({ name, contact });
                            }
                        }}>
                            Guardar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default SupplierManagement;
"use client";

import { useState, useEffect } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Autocomplete, AutocompleteItem } from "@heroui/react";
import { IPurchase, IPurchasePayload, IPurchaseItemPayload } from "../../types/purchases.type";
import { createPurchase, updatePurchase } from "../../services/purchase.service";
import { getSuppliers } from "../../services/suppliers.service";
import { getIngredients } from "../../services/ingredients.service";
import { getUnits } from "../../services/units.service";
import { IIngredient } from "../../types/ingredients.type";
import { IUnit } from "../../types/units.type";

interface PurchaseFormProps {
    isOpen: boolean;
    onClose: () => void;
    purchase: IPurchase | null;
    onSuccess: () => void;
}

const PurchaseForm = ({ isOpen, onClose, purchase, onSuccess }: PurchaseFormProps) => {
    const [formData, setFormData] = useState<IPurchasePayload>({ providerId: 0, purchaseItems: [] });
    const [suppliers, setSuppliers] = useState<{ id: number; name: string }[]>([]);
    const [ingredients, setIngredients] = useState<IIngredient[]>([]);
    const [units, setUnits] = useState<IUnit[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ providerId?: string; purchaseItems?: string }>({});

    useEffect(() => {
        if (isOpen) {
            fetchSuppliers();
            fetchIngredients();
            fetchUnits();
            if (purchase) {
                setFormData({
                    providerId: purchase.providerId,
                    purchaseItems: purchase.purchaseItems.map(item => ({
                        ingredientId: item.ingredientId.toString(),
                        cost: parseFloat(item.cost),
                        quantity: parseFloat(item.quantity),
                        unitId: item.unitId,
                        unitQuantity: parseFloat(item.unitQuantity),
                    })),
                });
            } else {
                setFormData({ providerId: 0, purchaseItems: [] });
            }
            setErrors({});
        }
    }, [isOpen, purchase]);

    // Recalcular unitQuantity cuando units cambie
    useEffect(() => {
        if (units.length > 0 && formData.purchaseItems.length > 0) {
            setFormData(prev => ({
                ...prev,
                purchaseItems: prev.purchaseItems.map(item => ({
                    ...item,
                    unitQuantity: calculateUnitQuantity(item.quantity, item.unitId),
                })),
            }));
        }
    }, [units]);

    const fetchSuppliers = async () => {
        try {
            const data = await getSuppliers();
            setSuppliers(data.data.map(s => ({ id: s.id, name: s.name })));
        } catch (err) {
            console.error("Error fetching suppliers");
        }
    };

    const fetchIngredients = async () => {
        try {
            const data = await getIngredients();
            setIngredients(data.data);
        } catch (err) {
            console.error("Error fetching ingredients");
        }
    };

    const fetchUnits = async () => {
        try {
            const data = await getUnits();
            setUnits(data);
        } catch (err) {
            console.error("Error fetching units");
        }
    };

    const calculateUnitQuantity = (quantity: number, unitId: number): number => {
        const unit = units.find(u => u.id === unitId);
        return unit ? quantity * parseFloat(unit.factor) : 0;
    };

    const addItem = () => {
        setFormData({
            ...formData,
            purchaseItems: [...formData.purchaseItems, { ingredientId: "", cost: 0, quantity: 0, unitId: 1, unitQuantity: 1 }],
        });
    };

    const removeItem = (index: number) => {
        setFormData({
            ...formData,
            purchaseItems: formData.purchaseItems.filter((_, i) => i !== index),
        });
    };

    const updateItem = (index: number, field: keyof IPurchaseItemPayload, value: number | string) => {
        const newItems = [...formData.purchaseItems];
        newItems[index] = { ...newItems[index], [field]: value };

        // Calcular unitQuantity automáticamente si cambia quantity o unitId
        if (field === "quantity" || field === "unitId") {
            newItems[index].unitQuantity = calculateUnitQuantity(newItems[index].quantity, newItems[index].unitId);
        }

        setFormData({ ...formData, purchaseItems: newItems });
    };

    const validateForm = (): boolean => {
        const newErrors: { providerId?: string; purchaseItems?: string } = {};
        if (!formData.providerId) newErrors.providerId = "Proveedor es requerido";
        if (formData.purchaseItems.length === 0) newErrors.purchaseItems = "Al menos un item es requerido";
        formData.purchaseItems.forEach((item, index) => {
            if (!item.ingredientId) newErrors.purchaseItems = `Item ${index + 1}: Ingrediente requerido`;
            if (item.cost <= 0) newErrors.purchaseItems = `Item ${index + 1}: Costo debe ser mayor a 0`;
            if (item.quantity <= 0) newErrors.purchaseItems = `Item ${index + 1}: Cantidad debe ser mayor a 0`;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setLoading(true);
        try {
            if (purchase) {
                await updatePurchase(purchase.id, formData);
            } else {
                await createPurchase(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Error saving purchase");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
            <ModalContent>
                <ModalHeader>
                    {purchase ? "Editar Compra" : "Nueva Compra"}
                </ModalHeader>
                <ModalBody>
                    <Autocomplete
                        label="Proveedor"
                        selectedKey={formData.providerId ? formData.providerId.toString() : ""}
                        onSelectionChange={(key) => setFormData({ ...formData, providerId: key ? parseInt(key as string) : 0 })}
                        errorMessage={errors.providerId}
                        isInvalid={!!errors.providerId}
                    >
                        {suppliers.map((supplier) => (
                            <AutocompleteItem key={supplier.id.toString()} textValue={supplier.name}>
                                {supplier.name}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>

                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Items de Compra</h4>
                        {formData.purchaseItems.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2 items-end">
                                <Autocomplete
                                    label="Ingrediente"
                                    selectedKey={item.ingredientId ? item.ingredientId.toString() : ""}
                                    onSelectionChange={(key) => updateItem(index, "ingredientId", key ? parseInt(key as string) : 0)}
                                    className="w-1/6"
                                >
                                    {ingredients.map((ingredient) => (
                                        <AutocompleteItem key={ingredient.id.toString()} textValue={ingredient.name}>
                                            {ingredient.name}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                                <Input
                                    label="Costo"
                                    type="number"
                                    step="0.01"
                                    value={item.cost.toString()}
                                    onChange={(e) => updateItem(index, "cost", parseFloat(e.target.value))}
                                    className="w-1/6"
                                />
                                <Input
                                    label="Cantidad"
                                    type="number"
                                    step="0.01"
                                    value={item.quantity.toString()}
                                    onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value))}
                                    className="w-1/6"
                                />
                                <Autocomplete
                                    label="Unidad"
                                    selectedKey={item.unitId ? item.unitId.toString() : ""}
                                    onSelectionChange={(key) => updateItem(index, "unitId", key ? parseInt(key as string) : 0)}
                                    className="w-1/6"
                                >
                                    {units.map((unit) => (
                                        <AutocompleteItem key={unit.id.toString()} textValue={unit.name}>
                                            {unit.name}
                                        </AutocompleteItem>
                                    ))}
                                </Autocomplete>
                                <Input
                                    label="Cantidad Unidad"
                                    type="number"
                                    step="0.01"
                                    value={item.unitQuantity.toString()}
                                    isReadOnly
                                    className="w-1/6"
                                />
                                <Button color="danger" size="sm" onPress={() => removeItem(index)}>
                                    Eliminar
                                </Button>
                            </div>
                        ))}
                        <Button onPress={addItem} className="mt-2">
                            Agregar Item
                        </Button>
                        {errors.purchaseItems && <p className="text-red-500 text-sm mt-1">{errors.purchaseItems}</p>}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                        Cancelar
                    </Button>
                    <Button color="primary" onPress={handleSubmit} isLoading={loading}>
                        {purchase ? "Actualizar" : "Crear"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default PurchaseForm;
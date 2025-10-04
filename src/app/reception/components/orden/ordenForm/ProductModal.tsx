import React from "react";
import { Button, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { ICategory } from "@/app/types/categories.type";

interface IIngredient {
    id: number;
    quantity: number;
}

type ProductFormType = {
    name: string;
    price: number;
    category: number;
    ingredients: IIngredient[];
};

interface ProductModalProps {
    productModalOpen: boolean;
    setProductModalOpen: (open: boolean) => void;
    productModalMode: 'create' | 'edit';
    productForm: ProductFormType;
    setProductForm: React.Dispatch<React.SetStateAction<ProductFormType>>;
    categories: ICategory[];
    productModalLoading: boolean;
    productModalError: string | null;
    saveProduct: () => void;
    deleteProductHandler: () => void;
}

const ProductModal = ({
    productModalOpen,
    setProductModalOpen,
    productModalMode,
    productForm,
    setProductForm,
    categories,
    productModalLoading,
    productModalError,
    saveProduct,
    deleteProductHandler
}: ProductModalProps) => {
    return (
        <Modal isOpen={productModalOpen} onOpenChange={setProductModalOpen} size="lg">
            <ModalContent>
                <ModalHeader>{productModalMode === 'create' ? 'Crear Producto' : 'Editar Producto'}</ModalHeader>
                <ModalBody>
                    {productModalError && <p className="text-red-500 mb-4">{productModalError}</p>}
                    <Input
                        label="Nombre"
                        value={productForm.name}
                        onChange={(e) => setProductForm((prev: ProductFormType) => ({ ...prev, name: e.target.value }))}
                        required
                    />
                    <Input
                        label="Precio"
                        type="number"
                        value={productForm.price.toString()}
                        onChange={(e) => setProductForm((prev: ProductFormType) => ({ ...prev, price: Number(e.target.value) }))}
                        required
                    />
                    <Select
                        label="Categoría"
                        selectedKeys={[productForm.category.toString()]}
                        onSelectionChange={(keys) => setProductForm((prev: ProductFormType) => ({ ...prev, category: Number(Array.from(keys)[0]) }))}
                    >
                        {categories.map((category) => (
                            <SelectItem key={category.id.toString()}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </Select>
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Ingredientes</h4>
                        {productForm.ingredients.map((ing, index) => (
                            <div key={index} className="flex space-x-2 mb-2">
                                <Input
                                    label="ID Ingrediente"
                                    type="number"
                                    value={ing.id.toString()}
                                    onChange={(e) => {
                                        const newIngs = [...productForm.ingredients];
                                        newIngs[index].id = Number(e.target.value);
                                        setProductForm((prev: ProductFormType) => ({ ...prev, ingredients: newIngs }));
                                    }}
                                />
                                <Input
                                    label="Cantidad"
                                    type="number"
                                    value={ing.quantity.toString()}
                                    onChange={(e) => {
                                        const newIngs = [...productForm.ingredients];
                                        newIngs[index].quantity = Number(e.target.value);
                                        setProductForm((prev: ProductFormType) => ({ ...prev, ingredients: newIngs }));
                                    }}
                                />
                                <Button type="button" onPress={() => {
                                    const newIngs = productForm.ingredients.filter((_, i) => i !== index);
                                    setProductForm((prev: ProductFormType) => ({ ...prev, ingredients: newIngs }));
                                }} color="danger" size="sm">
                                    X
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onPress={() => setProductForm((prev: ProductFormType) => ({
                            ...prev,
                            ingredients: [...prev.ingredients, { id: 1, quantity: 1 }]
                        }))} size="sm">
                            Agregar Ingrediente
                        </Button>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {productModalMode === 'edit' && (
                        <Button onPress={deleteProductHandler} color="danger" disabled={productModalLoading}>
                            Eliminar
                        </Button>
                    )}
                    <Button onPress={() => setProductModalOpen(false)}>Cancelar</Button>
                    <Button onPress={saveProduct} color="primary" disabled={productModalLoading}>
                        {productModalLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ProductModal;

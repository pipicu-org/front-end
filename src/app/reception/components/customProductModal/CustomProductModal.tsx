import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { IProduct } from "../../../types/products.type";

interface CustomProductModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    selectedProduct: IProduct | null;
    productQuantities: { [key: string]: number };
}

const CustomProductModal = ({
    isOpen,
    onOpenChange,
    selectedProduct,
    productQuantities,
}: CustomProductModalProps) => {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader>Configuración del Producto</ModalHeader>
                <ModalBody>
                    {selectedProduct && (
                        <div>
                            <p><strong>Nombre:</strong> {selectedProduct.name}</p>
                            <p><strong>Precio:</strong> ${selectedProduct.price}</p>
                            <p><strong>Cantidad actual:</strong> {productQuantities[selectedProduct.id] || 0}</p>
                            {/* Aquí puedes agregar más opciones de configuración */}
                        </div>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" variant="light" onPress={() => onOpenChange(false)}>
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CustomProductModal;
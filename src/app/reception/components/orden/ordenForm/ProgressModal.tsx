"use client";

import { Modal, ModalContent, Progress } from "@heroui/react";

interface ProgressModalProps {
    isOpen: boolean;
    progress: number;
    onClose: () => void;
}

const ProgressModal = ({ isOpen, progress, onClose }: ProgressModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" isDismissable={false}>
            <ModalContent>
                <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Guardando Orden...</h3>
                    <Progress
                        value={progress}
                        color="primary"
                        size="md"
                        className="mb-4"
                    />
                    <p className="text-sm text-gray-600">
                        Procesando productos personalizados y creando orden...
                    </p>
                </div>
            </ModalContent>
        </Modal>
    );
};

export default ProgressModal;
import React from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";

type ClientFormType = {
    name: string;
    phoneNumber: string;
    address: string;
    facebookUsername: string;
    instagramUsername: string;
};

interface ClientModalProps {
    clientModalOpen: boolean;
    setClientModalOpen: (open: boolean) => void;
    clientModalMode: 'create' | 'edit';
    clientForm: ClientFormType;
    setClientForm: React.Dispatch<React.SetStateAction<ClientFormType>>;
    clientModalLoading: boolean;
    clientModalError: string | null;
    saveClient: () => void;
}

const ClientModal = ({
    clientModalOpen,
    setClientModalOpen,
    clientModalMode,
    clientForm,
    setClientForm,
    clientModalLoading,
    clientModalError,
    saveClient
}: ClientModalProps) => {
    return (
        <Modal isOpen={clientModalOpen} onOpenChange={setClientModalOpen} size="lg">
            <ModalContent>
                <ModalHeader>{clientModalMode === 'create' ? 'Crear Cliente' : 'Editar Cliente'}</ModalHeader>
                <ModalBody>
                    {clientModalError && <p className="text-red-500 mb-4">{clientModalError}</p>}
                    <Input
                        label="Nombre"
                        value={clientForm.name}
                        onChange={(e) => setClientForm((prev: ClientFormType) => ({ ...prev, name: e.target.value }))}
                        required
                    />
                    <Input
                        label="Teléfono"
                        value={clientForm.phoneNumber}
                        onChange={(e) => setClientForm((prev: ClientFormType) => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                    />
                    <Input
                        label="Dirección"
                        value={clientForm.address}
                        onChange={(e) => setClientForm((prev: ClientFormType) => ({ ...prev, address: e.target.value }))}
                        required
                    />
                    <Input
                        label="Usuario Facebook (opcional)"
                        value={clientForm.facebookUsername || ''}
                        onChange={(e) => setClientForm((prev: ClientFormType) => ({ ...prev, facebookUsername: e.target.value }))}
                    />
                    <Input
                        label="Usuario Instagram (opcional)"
                        value={clientForm.instagramUsername || ''}
                        onChange={(e) => setClientForm((prev: ClientFormType) => ({ ...prev, instagramUsername: e.target.value }))}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => setClientModalOpen(false)}>Cancelar</Button>
                    <Button onClick={saveClient} color="primary" disabled={clientModalLoading}>
                        {clientModalLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ClientModal;

import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { IClient } from "@/app/types/clients.type";

interface ClientModalProps {
    clientModalOpen: boolean;
    setClientModalOpen: (open: boolean) => void;
    clientModalMode: 'create' | 'edit';
    selectedClient: IClient | null;
    clientForm: {
        name: string;
        phoneNumber: string;
        address: string;
        facebookUsername?: string;
        instagramUsername?: string;
    };
    setClientForm: (form: any) => void;
    clientModalLoading: boolean;
    clientModalError: string | null;
    saveClient: () => void;
}

const ClientModal = ({
    clientModalOpen,
    setClientModalOpen,
    clientModalMode,
    selectedClient,
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
                        onChange={(e) => setClientForm((prev: any) => ({ ...prev, name: e.target.value }))}
                        required
                    />
                    <Input
                        label="Teléfono"
                        value={clientForm.phoneNumber}
                        onChange={(e) => setClientForm((prev: any) => ({ ...prev, phoneNumber: e.target.value }))}
                        required
                    />
                    <Input
                        label="Dirección"
                        value={clientForm.address}
                        onChange={(e) => setClientForm((prev: any) => ({ ...prev, address: e.target.value }))}
                        required
                    />
                    <Input
                        label="Usuario Facebook (opcional)"
                        value={clientForm.facebookUsername || ''}
                        onChange={(e) => setClientForm((prev: any) => ({ ...prev, facebookUsername: e.target.value }))}
                    />
                    <Input
                        label="Usuario Instagram (opcional)"
                        value={clientForm.instagramUsername || ''}
                        onChange={(e) => setClientForm((prev: any) => ({ ...prev, instagramUsername: e.target.value }))}
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
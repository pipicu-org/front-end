import { useState, useEffect } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardBody, Pagination } from "@heroui/react";
import { searchClients, createClient, updateClient } from "@/app/services/clients.service";
import { IClient } from "@/app/types/clients.type";
import ClientModal from "./ClientModal";

interface ClientSelectorProps {
    client: number;
    setClient: (client: number) => void;
    setPhone: (phone: string) => void;
    setAddress: (address: string) => void;
    clients: IClient[];
    onReloadClients: () => void;
}

const ClientSelector = ({ client, setClient, setPhone, setAddress, clients, onReloadClients }: ClientSelectorProps) => {
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const [clientSearch, setClientSearch] = useState("");
    const [clientPage, setClientPage] = useState(1);
    const [clientResults, setClientResults] = useState<IClient[]>([]);
    const [clientTotal, setClientTotal] = useState(0);
    const [clientLoading, setClientLoading] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);

    // Estados para modal de gestión de clientes
    const [clientManagementModalOpen, setClientManagementModalOpen] = useState(false);
    const [clientManagementMode, setClientManagementMode] = useState<'create' | 'edit'>('create');
    const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
    const [clientForm, setClientForm] = useState({
        name: '',
        phone: '',
        address: '',
        facebookUsername: '',
        instagramUsername: ''
    });
    const [clientManagementLoading, setClientManagementLoading] = useState(false);
    const [clientManagementError, setClientManagementError] = useState<string | null>(null);
    const [selectedClientInModal, setSelectedClientInModal] = useState<IClient | null>(null);

    // Función para buscar clientes en el modal
    const searchClientsModal = async (search: string, page: number) => {
        setClientLoading(true);
        setClientError(null);
        try {
            const response = await searchClients(search, page);
            setClientResults(response.data);
            setClientTotal(response.total);
        } catch (error) {
            setClientError("Error al buscar clientes");
            console.error(error);
        } finally {
            setClientLoading(false);
        }
    };

    // Efecto para buscar cuando cambia búsqueda o página
    useEffect(() => {
        if (clientModalOpen) {
            searchClientsModal(clientSearch, clientPage);
        }
    }, [clientSearch, clientPage, clientModalOpen]);

    // Función para seleccionar cliente del modal
    const selectClient = (selectedClient: IClient) => {
        setClient(Number(selectedClient.id));
        setPhone(selectedClient.phone);
        setAddress(selectedClient.address);
        setClientModalOpen(false);
        setClientSearch(selectedClient.name);
        setClientPage(1);
    };

    // Función para abrir modal de gestión de cliente
    const openClientManagementModal = (mode: 'create' | 'edit', client?: IClient) => {
        setClientManagementMode(mode);
        if (mode === 'edit' && client) {
            setSelectedClient(client);
            setClientForm({
                name: client.name,
                phone: client.phone,
                address: client.address,
                facebookUsername: client.facebookUsername || '',
                instagramUsername: client.instagramUsername || ''
            });
        } else {
            setSelectedClient(null);
            setClientForm({
                name: '',
                phone: '',
                address: '',
                facebookUsername: '',
                instagramUsername: ''
            });
        }
        setClientManagementModalOpen(true);
    };

    // Función para guardar cliente
    const saveClient = async () => {
        if (!clientForm.name || !clientForm.phone || !clientForm.address) {
            setClientManagementError("Nombre, teléfono y dirección son requeridos");
            return;
        }
        setClientManagementLoading(true);
        setClientManagementError(null);
        try {
            if (clientManagementMode === 'create') {
                await createClient(clientForm);
            } else if (selectedClient) {
                await updateClient(selectedClient.id, clientForm);
            }
            onReloadClients();
            setClientManagementModalOpen(false);
        } catch (error) {
            setClientManagementError("Error al guardar cliente");
            console.error(error);
        } finally {
            setClientManagementLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center space-x-2">
                <Input
                    label="Cliente"
                    value={clients.find(c => String(c.id) === String(client))?.name || ""}
                    readOnly
                />
                <Button onPress={() => setClientModalOpen(true)} className="h-full">
                    Buscar Cliente
                </Button>
            </div>




            {/* Modal de búsqueda de clientes */}
            <Modal isOpen={clientModalOpen} onOpenChange={setClientModalOpen} size="2xl">
                <ModalContent>
                    <ModalHeader>Buscar Cliente</ModalHeader>
                    <ModalBody>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Buscar por nombre, teléfono o email"
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                            />
                            <Button
                                className="px-1 py-0 min-w-0 w-fit aspect-square min-h-0 rounded-full bg-black/20 text-white"
                                onPress={() => openClientManagementModal('create')}>+</Button>
                        </div>
                        {clientLoading && <p>Cargando...</p>}
                        {clientError && <p className="text-red-500">{clientError}</p>}
                        <div className="grid grid-cols-3 gap-2 mt-4 max-h-96 overflow-y-auto">
                            {clientResults.map((c) => (
                                <Card
                                    className={`h-[8rem] ${selectedClientInModal?.id === c.id
                                        ? 'border border-2 border-blue-500'
                                        : ''
                                    }`}
                                    key={c.id}
                                    isPressable
                                    onPress={() => setSelectedClientInModal(c)}>
                                    <CardBody>
                                        <p className="font-semibold">{c.name}</p>
                                        <p className="text-sm text-gray-600">{c.phone}</p>
                                        <p className="text-sm text-gray-600">{c.address}</p>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                        {clientTotal > 10 && (
                            <Pagination
                                total={Math.ceil(clientTotal / 10)}
                                page={clientPage}
                                onChange={setClientPage}
                                className="mt-4"
                            />
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onPress={() => selectedClientInModal && openClientManagementModal('edit', selectedClientInModal)}
                            disabled={!selectedClientInModal}>
                            Editar Cliente Seleccionado
                        </Button>
                        <Button
                            onPress={() => selectedClientInModal && selectClient(selectedClientInModal)}
                            disabled={!selectedClientInModal}
                            color="primary">
                            Seleccionar Cliente
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <ClientModal
                clientModalOpen={clientManagementModalOpen}
                setClientModalOpen={setClientManagementModalOpen}
                clientModalMode={clientManagementMode}
                clientForm={clientForm}
                setClientForm={setClientForm}
                clientModalLoading={clientManagementLoading}
                clientModalError={clientManagementError}
                saveClient={saveClient}
            />
        </>
    );
};

export default ClientSelector;

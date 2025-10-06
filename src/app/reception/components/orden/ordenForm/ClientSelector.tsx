import { useState, useEffect } from "react";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Card, CardBody, Pagination } from "@heroui/react";
import { searchClients, createClient, updateClient } from "@/app/services/clients.service";
import { IClient } from "@/app/types/clients.type";
import ClientModal from "./ClientModal";

interface ClientSelectorProps {
    client: number;
    setClient: (client: number) => void;
    clients: IClient[];
    onReloadClients: () => void;
}

const ClientSelector = ({ client, setClient, clients, onReloadClients }: ClientSelectorProps) => {
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
        phoneNumber: '',
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
                phoneNumber: client.phoneNumber,
                address: client.address,
                facebookUsername: client.facebookUsername || '',
                instagramUsername: client.instagramUsername || ''
            });
        } else {
            setSelectedClient(null);
            setClientForm({
                name: '',
                phoneNumber: '',
                address: '',
                facebookUsername: '',
                instagramUsername: ''
            });
        }
        setClientManagementModalOpen(true);
    };

    // Función para guardar cliente
    const saveClient = async () => {
        if (!clientForm.name || !clientForm.phoneNumber || !clientForm.address) {
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

    const style = {
        background: `linear-gradient(
                      135deg,
                      rgba(161, 161, 161, 0.5) 0%,
                      rgba(161, 161, 161, 0.05) 66%,
                      rgba(161, 161, 161, 0.6) 100%
                    ), #ffffff`
    }

    return (
        <>
            <div className="flex flex-col w-full space-y-1">
                <label htmlFor="deliveryTime" className="text-sm font-medium text-black/50">
                    Cliente
                </label>

                <div className="flex space-x-2 w-full">
                    <input
                        id="deliveryTime"
                        type="text"
                        value={clientSearch || ""}
                        onChange={(e) => setClientSearch(e.target.value)}
                        placeholder="Buscar cliente"
                        className="flex-1 rounded-md border border-none bg-primary/20 px-3 py-2 text-sm text-primary shadow-sm placeholder:text-primary/60 focus:outline-none transition"
                        readOnly
                    />

                    <Button onClick={() => setClientModalOpen(true)} style={style} className="flex flex-col items-center justify-center rounded-2xl text-primary">
                        Buscar Cliente
                    </Button>
                </div>
            </div>




            {/* Modal de búsqueda de clientes */}
            <Modal isOpen={clientModalOpen} onOpenChange={setClientModalOpen} size="2xl">
                <ModalContent>
                    <ModalHeader>Buscar Cliente</ModalHeader>
                    <ModalBody>
                        <Input
                            placeholder="Buscar por nombre, teléfono o email"
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                        />
                        {clientLoading && <p>Cargando...</p>}
                        {clientError && <p className="text-red-500">{clientError}</p>}
                        <div className="grid grid-cols-1 gap-2 mt-4 max-h-96 overflow-y-auto">
                            {clientResults.map((c) => (
                                <Card key={c.id} isPressable onPress={() => setSelectedClientInModal(c)}>
                                    <CardBody>
                                        <p className="font-semibold">{c.name}</p>
                                        <p className="text-sm text-gray-600">{c.phoneNumber} - {c.address}</p>
                                        {selectedClientInModal?.id === c.id && <p className="text-blue-500">Seleccionado</p>}
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
                        <Button onClick={() => openClientManagementModal('create')}>Crear Nuevo Cliente</Button>
                        <Button onClick={() => selectedClientInModal && openClientManagementModal('edit', selectedClientInModal)} disabled={!selectedClientInModal}>
                            Editar Cliente Seleccionado
                        </Button>
                        <Button onClick={() => selectedClientInModal && selectClient(selectedClientInModal)} disabled={!selectedClientInModal} color="primary">
                            Seleccionar Cliente
                        </Button>
                        <Button onClick={() => setClientModalOpen(false)}>Cerrar</Button>
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

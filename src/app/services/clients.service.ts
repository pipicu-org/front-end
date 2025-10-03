import api from "./api";
import { IClient } from "../types/clients.type";

// Crear cliente
export async function createClient(client: Omit<IClient, 'id'>) {
  const { data } = await api.post("/client", client);
  return data;
}

// Obtener cliente por id
interface IGetClient {
  data: IClient
}

export async function getClientById(id: number): Promise<IGetClient> {
  const { data }: { data: IGetClient } = await api.get(`/client/${id}`);
  return data;
}

// Actualizar cliente
export async function updateClient(id: number, client: Partial<IClient>) {
  const { data } = await api.patch(`/client/${id}`, client);
  return data;
}

// Buscar clientes con paginación
interface IGetClients {
  data: IClient[]
  limit: number
  page: number
  search: string
  total: number
}

export async function searchClients(search: string, page: number = 1): Promise<IGetClients> {
  const { data }: { data: IGetClients } = await api.get(`/client`, {
    params: { search, page },
  });

  return data;
}

// Eliminar cliente
export async function deleteClient(id: number) {
  const { data } = await api.delete(`/client/${id}`);
  return data;
}

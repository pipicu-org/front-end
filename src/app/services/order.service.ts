import api from "./api";

// Crear cliente
export async function saveOrder(order: IOrder) {
  const { data } = await api.post("/orders/reception", );
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
interface IGetOrders {
  search: string
  total: number
  page: number
  limit: number
  data: IOrder[]
}

export async function getOrdersByStateID(id: string): Promise<IGetOrders> {
  const { data }: { data: IGetOrders } = await api.get(`/orders/state?stateId=${id}`, {
    params: { id },
  });

  return data;
}

// export async function searchClients(search: string, page: number = 1): Promise<IGetClients> {
//   const { data }: { data: IGetClients } = await api.get(`/client`, {
//     params: { search, page },
//   });

//   return data;
// }

// Eliminar cliente
export async function deleteClient(id: number) {
  const { data } = await api.delete(`/client/${id}`);
  return data;
}

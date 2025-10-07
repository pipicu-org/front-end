import api from "./api";
import { IClient } from "../types/clients.type";
import { IOrder } from "../types/orders.type";

// Interfaces para API
interface IOrderLine {
  product: number;
  quantity: number;
}

interface IOrderPayload {
  client: number;
  deliveryTime: string;
  contactMethod: string;
  paymentMethod: string;
  lines: IOrderLine[];
}

export interface IOrderDetailLine {
  id: string;
  product: string;
  quantity: string;
  totalPrice: number;
  state: string;
  personalization: unknown[];
}

export interface IOrderDetail {
  id: string;
  state: string;
  client: string;
  phone: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
  totalPrice: string;
  lines: IOrderDetailLine[];
}

// Crear orden
export async function createOrder(order: IOrderPayload) {
  const { data } = await api.post("/orders/reception", order);
  return data;
}

// Actualizar orden
export async function updateOrder(id: string, order: IOrderPayload) {
  const { data } = await api.patch(`/orders/reception/${id}`, order);
  return data;
}

// Obtener orden por ID
export async function getOrderById(id: string): Promise<IOrderDetail> {
  const { data } = await api.get(`/orders/reception/${id}`);
  return data;
}

// Crear orden (legacy)
export async function saveOrder(order: IOrder) {
  const { data } = await api.post("/orders/reception", order);
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

export async function getOrdersByStateID(stateId: string, search: string = "", page: number = 1, limit: number = 10): Promise<IGetOrders> {
  const { data }: { data: IGetOrders } = await api.get(`/orders/state`, {
    params: { stateId, search, page, limit },
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

// Actualizar estado de orden
export async function updateOrderState(orderId: number, stateId: number) {
  const { data } = await api.patch("/orders/state", { orderId, stateId });
  return data;
}

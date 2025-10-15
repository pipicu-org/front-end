export type ORDER_STATUS = "Creados" | "Pendientes" | "Preparados" | "En camino" | "Entregado" | "Cancelado";
export type ORDER_UI_STATE = "default" | "ver" | "editar" | "nueva";

export interface IOrder {
  id: string;
  state: ORDER_STATUS;
  client: string;
  name: string;
  phoneNumber: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
  totalPrice: number;
}

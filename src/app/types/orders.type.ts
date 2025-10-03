type ORDER_STATUS = "Creados" | "Pendientes" | "Preparados" | "En camino" | "Entregado" | "Cancelado";
type ORDER_UI_STATE = "default" | "ver" | "editar" | "nueva";

interface IOrder {
  id: string;
  state: ORDER_STATUS;
  client: string;
  phone: string;
  address: string;
  deliveryTime: string;
  paymentMethod: string;
  totalPrice: number;
}

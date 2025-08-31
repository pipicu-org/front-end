type ORDER_STATUS = "Creados" | "Pendientes" | "Preparados" | "En camino" | "Entregado" | "Cancelado";
type ORDER_UI_STATE = "default" | "ver" | "editar" | "nueva";

interface IOrder {
  id: string;
  state: ORDER_STATUS;
  client: string;
  phone: String;
  address: String;
  deliveryTime: string;
  paymentMethod: String;
  totalPrice: number;
}


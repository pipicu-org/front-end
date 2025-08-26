export default interface Order {
  id: string;
  state: "Creados" | "Pendientes" | "Preparados" | "En camino" | "Entregado" | "Cancelado";
  client: string;
  phone: String;
  address: String;
  deliveryTime: string;
  paymentMethod: String;
  totalPrice: number;
}
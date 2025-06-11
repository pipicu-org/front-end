export default interface Order {
  id: string;
  name: string;
  estimatedTime: string;
  state: "Creados" | "Pendientes" | "Preparados" | "En camino";
}

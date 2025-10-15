import { IOrder as Order } from '@/app/types/orders.type';

const states: Order["state"][] = ["Creados", "Pendientes", "Preparados", "En camino", "Entregado", "Cancelado"];
const names = ["Juan", "Ana", "Luis", "María", "Carlos", "Sofía", "Miguel", "Valentina", "Diego", "Lucía"];
const surnames = ["Pérez", "Gómez", "Martínez", "López", "Ramírez", "Torres", "Ángel", "Ruiz", "Fernández", "Moreno"];

const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomPrice = (): number => Math.floor(Math.random() * 2000) + 1000; // 1000 a 3000
const randomHour = (): string => `${Math.floor(Math.random() * 5 + 10)}:${Math.random() < 0.5 ? "00" : "30"}`;

const ordenesAleatorias: Order[] = Array.from({ length: 100 }, (_, i) => ({
  id: (i + 1).toString(),
  state: randomItem(states),
  client: `${randomItem(names)} ${randomItem(surnames)}`,
  name: `Pedido ${i + 1}`,
  deliveryTime: randomHour(),
  total: randomPrice().toString(),
}));

export default ordenesAleatorias;

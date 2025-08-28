import Order from '@/entities/order'; // Ajusta la ruta según tu proyecto

const states: Order["state"][] = ["Creados", "Pendientes", "Preparados", "En camino", "Entregado", "Cancelado"];
const paymentMethods: Order["paymentMethod"][] = ["Efectivo", "Tarjeta"];
const names = ["Juan", "Ana", "Luis", "María", "Carlos", "Sofía", "Miguel", "Valentina", "Diego", "Lucía"];
const surnames = ["Pérez", "Gómez", "Martínez", "López", "Ramírez", "Torres", "Ángel", "Ruiz", "Fernández", "Moreno"];

const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomPrice = (): number => Math.floor(Math.random() * 2000) + 1000; // 1000 a 3000
const randomHour = (): string => `${Math.floor(Math.random() * 5 + 10)}:${Math.random() < 0.5 ? "00" : "30"}`;

const ordenesAleatorias: Order[] = Array.from({ length: 100 }, (_, i) => ({
  id: (i + 1).toString(),
  state: randomItem(states),
  client: `${randomItem(names)} ${randomItem(surnames)}`,
  phone: (Math.floor(Math.random() * 9000000000) + 1000000000).toString(),
  address: `Calle ${String.fromCharCode(65 + (i % 26))} ${Math.floor(Math.random() * 100 + 1)}`,
  deliveryTime: randomHour(),
  paymentMethod: randomItem(paymentMethods),
  totalPrice: randomPrice(),
}));

export default ordenesAleatorias;


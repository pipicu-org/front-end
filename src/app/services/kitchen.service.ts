import api from "./api";
import { IKitchenOrdersResponse, IComandaOrdersResponse } from "../types/orders.type";

// Get kitchen orders for fire table
export async function getKitchenOrders(
  page: number = 1,
  limit: number = 10,
  productId?: number
): Promise<IKitchenOrdersResponse> {
  const params: Record<string, unknown> = { page, limit };
  if (productId) params.productId = productId;

  const { data } = await api.get("/orders/kitchen", { params });
  return data;
}

// Get comanda orders for command table
export async function getComandaOrders(): Promise<IComandaOrdersResponse> {
  const { data } = await api.get("/orders/comanda/kitchen");
  return data;
}

// Get all products for filtering (assuming there's an endpoint for this)
export async function getKitchenProducts() {
  // This might need to be implemented based on available endpoints
  // For now, we'll extract unique products from the kitchen orders
  const orders = await getKitchenOrders(1, 1000); // Get many to extract products
  const products = new Map<number, { id: number; name: string }>();

  orders.data.forEach((item) => {
    if (!products.has(item.product.id)) {
      products.set(item.product.id, item.product);
    }
  });

  return Array.from(products.values());
}
import api from "./api";
import { IStockMovementResponse } from "../types/stockMovements.type";

export async function getStockMovements(page: number = 1, limit: number = 10): Promise<IStockMovementResponse> {
  const { data } = await api.get(`/stockMovement?page=${page}&limit=${limit}`);
  return data;
}
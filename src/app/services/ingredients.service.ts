import api from "./api";
import { IIngredient, IGetIngredients, IIngredientPayload } from "../types/ingredients.type";

// Obtener ingredientes con paginación y búsqueda
export async function getIngredients(search?: string, page: number = 1, limit: number = 10): Promise<IGetIngredients> {
  const params: Record<string, unknown> = { page, limit };
  if (search) params.search = search;
  const { data }: { data: IGetIngredients } = await api.get("/ingredient", { params });
  return data;
}

// Crear ingrediente
export async function createIngredient(ingredient: IIngredientPayload): Promise<IIngredient> {
  const { data } = await api.post("/ingredient", ingredient);
  return data;
}

// Actualizar ingrediente
export async function updateIngredient(id: string, ingredient: Partial<IIngredientPayload>): Promise<IIngredient> {
  const { data } = await api.patch(`/ingredient/${id}`, ingredient);
  return data;
}

// Eliminar ingrediente
export async function deleteIngredient(id: string): Promise<void> {
  await api.delete(`/ingredient/${id}`);
}
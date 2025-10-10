import api from "./api";
import { IUnit, IUnitPayload } from "../types/units.type";

// Obtener lista de unidades
export async function getUnits(): Promise<IUnit[]> {
  const { data } = await api.get("/unit");
  return data;
}

// Obtener unidad por ID
export async function getUnit(id: string): Promise<IUnit> {
  const { data } = await api.get(`/unit/${id}`);
  return data;
}

// Crear unidad
export async function createUnit(unit: IUnitPayload): Promise<IUnit> {
  const { data } = await api.post("/unit", unit);
  return data;
}

// Actualizar unidad
export async function updateUnit(id: string, unit: Partial<IUnitPayload>): Promise<IUnit> {
  const { data } = await api.put(`/unit/${id}`, unit);
  return data;
}

// Eliminar unidad
export async function deleteUnit(id: string): Promise<void> {
  await api.delete(`/unit/${id}`);
}
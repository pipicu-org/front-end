import api from "./api";
import { IUnit } from "../types/units.type";

// Obtener lista de unidades
export async function getUnits(): Promise<IUnit[]> {
  const { data } = await api.get("/unit");
  return data;
}
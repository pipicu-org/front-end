import api from "./api";
import { ISupplier, ISupplierPayload } from "../types/suppliers.type";

// Interfaces
interface IGetSuppliers {
  data: ISupplier[];
  total: number;
  page: number;
  limit: number;
}

// Obtener proveedores con paginación, búsqueda y ordenamiento
export async function getSuppliers(
  page: number = 1,
  limit: number = 10,
  search?: string,
  sort?: string
): Promise<IGetSuppliers> {
  const params: Record<string, unknown> = { page, limit };
  if (search) params.search = search;
  if (sort) params.sort = sort;
  const { data }: { data: IGetSuppliers } = await api.get("/provider", { params });
  return data;
}

// Crear proveedor
export async function createSupplier(supplier: ISupplierPayload): Promise<ISupplier> {
  const { data } = await api.post("/provider", supplier);
  return data;
}

// Actualizar proveedor
export async function updateSupplier(id: number, supplier: Partial<ISupplierPayload>): Promise<ISupplier> {
  const { data } = await api.patch(`/provider/${id}`, supplier);
  return data;
}

// Eliminar proveedor
export async function deleteSupplier(id: number): Promise<void> {
  await api.delete(`/provider/${id}`);
}
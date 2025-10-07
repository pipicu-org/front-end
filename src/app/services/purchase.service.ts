import api from "./api";
import { IPurchase, IPurchasePayload } from "../types/purchases.type";

// Obtener lista de compras
export async function getPurchases(): Promise<IPurchase[]> {
  const { data } = await api.get("/purchase");
  return data;
}

// Crear compra
export async function createPurchase(purchase: IPurchasePayload): Promise<IPurchase> {
  const { data } = await api.post("/purchase", purchase);
  return data;
}

// Obtener compra por ID
export async function getPurchaseById(id: number): Promise<IPurchase> {
  const { data } = await api.get(`/purchase/${id}`);
  return data;
}

// Actualizar compra
export async function updatePurchase(id: number, purchase: IPurchasePayload): Promise<IPurchase> {
  const { data } = await api.put(`/purchase/${id}`, purchase);
  return data;
}

// Eliminar compra
export async function deletePurchase(id: number): Promise<void> {
  await api.delete(`/purchase/${id}`);
}

// Descargar template Excel
export async function downloadPurchaseTemplate(): Promise<Blob> {
  const { data } = await api.get("/purchase/template", { responseType: "blob" });
  return data;
}

// Subir Excel para carga masiva
export async function uploadPurchaseExcel(file: File): Promise<IPurchase> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post("/purchase/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
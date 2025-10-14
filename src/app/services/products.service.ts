import api from "./api";
import { IProduct, IProductPayload, IProductDetail } from "../types/products.type";

// Interfaces
interface IGetProducts {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
}

// Obtener productos con paginación y filtros
export async function getProducts(page: number = 1, limit: number = 10, category?: number): Promise<IGetProducts> {
  const params: Record<string, unknown> = { page, limit };
  if (category) params.category = category;
    console.log("📦 Params enviados:", params); 
  const { data }: { data: IGetProducts } = await api.get("/products", { params });
  return data;
}

// Crear producto
export async function createProduct(product: IProductPayload): Promise<IProduct> {
  const { data } = await api.post("/products", product);
  return data;
}

// Actualizar producto
export async function updateProduct(id: string, product: Partial<IProductPayload>): Promise<IProduct> {
  const { data } = await api.patch(`/products/${id}`, product);
  return data;
}

// Eliminar producto
export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

// Obtener producto por ID
export async function getProductById(id: string): Promise<IProduct> {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

// Obtener productos por categoría
export async function getProductsByCategory(categoryId: number, page: number = 1, limit: number = 10): Promise<IGetProducts> {
  const params: Record<string, unknown> = { page, limit };
  const { data }: { data: IGetProducts } = await api.get(`/products/category/${categoryId}`, { params });
  return data;
}

// Obtener detalles completos del producto por ID
export async function getProductDetailById(id: string): Promise<IProductDetail> {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

import api from "./api";

// Interfaces
interface IGetProducts {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
}

interface IProductPayload {
  name: string;
  price: number;
  category: number;
  ingredients: IIngredient[];
}

// Obtener productos con paginación y filtros
export async function getProducts(page: number = 1, limit: number = 10, category?: number): Promise<IGetProducts> {
  const params: Record<string, unknown> = { page, limit };
  if (category) params.category = category;
  const { data }: { data: IGetProducts } = await api.get("/products", { params });
  return data;
}

// Crear producto
export async function createProduct(product: IProductPayload): Promise<IProduct> {
  const { data } = await api.post("/products", product);
  return data;
}

// Actualizar producto
export async function updateProduct(id: number, product: Partial<IProductPayload>): Promise<IProduct> {
  const { data } = await api.patch(`/products/${id}`, product);
  return data;
}

// Eliminar producto
export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}

// Obtener producto por ID
export async function getProductById(id: number): Promise<IProduct> {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

// Obtener productos por categoría
export async function getProductsByCategory(categoryId: number): Promise<IGetProducts> {
  const { data }: { data: IGetProducts } = await api.get(`/products/category/${categoryId}`);
  return data;
}

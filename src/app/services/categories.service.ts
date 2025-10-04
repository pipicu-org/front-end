import api from "./api";
import { ICategory } from "@/app/types/categories.type";

export async function getCategories(): Promise<ICategory[]> {
    const { data }: { data: ICategory[] } = await api.get("/categories");
    return data;
}

// Crear categoría
export async function createCategory(category: { name: string }): Promise<ICategory> {
    const { data } = await api.post("/categories", category);
    return data;
}

// Actualizar categoría
export async function updateCategory(id: number, category: { name: string }): Promise<ICategory> {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
}

// Eliminar categoría
export async function deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
}
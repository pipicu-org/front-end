import api from "./api";
import { ICategory } from "@/app/types/categories.type";

export async function getCategories(): Promise<ICategory[]> {
    const { data }: { data: ICategory[] } = await api.get("/categories");
    return data;
}
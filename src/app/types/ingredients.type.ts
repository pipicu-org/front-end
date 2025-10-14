export interface IIngredient {
  id: string;
  name: string;
  unitId: number;
  stock: number;
  lossFactor: string;
  createdAt: string;
  updatedAt: string;
}

export interface IGetIngredients {
  data: IIngredient[];
  total: number;
  page: number;
  limit: number;
  search?: string;
}

export interface IIngredientPayload {
  name: string;
  unitId: number;
  lossFactor: number;
}
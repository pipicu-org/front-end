export interface IIngredient {
  id: number;
  name: string;
  price: number;
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
  price: number;
}
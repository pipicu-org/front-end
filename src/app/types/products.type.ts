export interface IIngredient {
  id: number;
  quantity: number;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  ingredients: IIngredient[];
  image?: string;
}

export interface IProductCategory {
  id: number;
  name: string;
}

export interface IGetProducts {
  data: IProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface IProductPayload {
  name: string;
  price: number;
  category: number;
  ingredients: IIngredient[];
}

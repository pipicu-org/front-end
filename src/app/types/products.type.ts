export interface IProductIngredient {
  id: number;
  quantity: number;
}

export interface IProduct {
  id: string;
  name: string;
  price: string;
  preTaxPrice: string;
  category: string;
  ingredients?: IProductIngredient[];
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
  preTaxPrice: number;
  price: number;
  category: number;
  ingredients: IProductIngredient[];
}

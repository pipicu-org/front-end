export interface IProductIngredient {
  id: number;
  quantity: number;
}

export interface IProduct {
  id: string;
  name: string;
  cost: string;
  price: string;
  preTaxPrice: string;
  category: string;
  maxPrepareable: string;
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

export interface IIngredientDetail {
  id: number;
  name: string;
  stock: number;
}

export interface IRecipeIngredient {
  id: number;
  quantity: string;
  ingredient: IIngredientDetail;
}

export interface IRecipeDetail {
  id: number;
  cost: number;
  ingredients: IRecipeIngredient[];
}

export interface ICategoryDetail {
  id: number;
  name: string;
}

export interface IProductDetail {
  id: number;
  name: string;
  preTaxPrice: string;
  price: string;
  recipeId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: ICategoryDetail;
  recipe: IRecipeDetail;
}

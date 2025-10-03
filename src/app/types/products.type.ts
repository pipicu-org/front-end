interface IIngredient {
  id: number;
  quantity: number;
}

interface IProduct {
  id: number;
  name: string;
  price: number;
  category: number;
  ingredients: IIngredient[];
  image?: string;
}

interface IProductCategory {
  id: number;
  name: string;
}

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
export type ORDER_STATUS = "Creados" | "Pendientes" | "Preparados" | "En camino" | "Entregado" | "Cancelado";
export type ORDER_UI_STATE = "default" | "ver" | "editar" | "nueva";

export interface IOrder {
  id: string;
  state: ORDER_STATUS;
  client: string;
  name: string;
  deliveryTime: string;
  total: string;
}

export interface IOrderDetail {
  id: string;
  state: string;
  client: string;
  phoneNumber: string;
  address: string;
  deliveryTime: string;
  contactMethod: string;
  paymentMethod: string;
  total: string;
  lines: IOrderDetailLine[];
}

export interface IOrderDetailLine {
  id: string;
  product: {
    id: string;
    name: string;
  };
  quantity: string;
  totalPrice: number;
}

export interface IOrderPayload {
  client: number;
  deliveryTime: string;
  contactMethod: string;
  paymentMethod: string;
  lines: IOrderLinePayload[];
}

export interface IOrderLinePayload {
  product: {
    id: number;
    name: string;
  };
  quantity: number;
}

export interface IOrderUpdatePayload {
  client: number;
  deliveryTime: string;
  contactMethod: string;
  paymentMethod: string;
  lines: IOrderUpdateLinePayload[];
}

export interface IOrderUpdateLinePayload {
  id: number;
  product: {
    id: number;
    name: string;
  };
  quantity: number;
}

// Kitchen-specific interfaces
export interface IKitchenOrderItem {
  orderId: number;
  lineId: number;
  preparationId: string;
  product: {
    id: number;
    name: string;
  };
  quantity: string;
  recipeIngredients: {
    ingredientId: number;
    ingredientName: string;
    quantity: number;
    unitName: string;
  }[];
}

export interface IKitchenOrdersResponse {
  total: number;
  page: number;
  limit: number;
  data: IKitchenOrderItem[];
}

export interface IComandaOrderLine {
  lineId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
  };
  recipe: {
    ingredient: {
      id: number;
      name: string;
    };
    unit: {
      id: number;
      name: string;
    };
    quantity: number;
  }[];
}

export interface IComandaOrder {
  orderId: number;
  client: {
    id: number;
    name: string;
  };
  lines: IComandaOrderLine[];
}

export interface IComandaOrdersResponse {
  page: number;
  limit: number;
  total: number;
  data: IComandaOrder[];
}

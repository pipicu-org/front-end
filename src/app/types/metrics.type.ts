// Tipos para las respuestas de las APIs de métricas

export interface GMVByDay {
  day: string;
  gmv: number;
}

export interface GPByDay {
  day: string;
  gp: number;
}

export interface GMVByPaymentMethod {
  paymentMethod: string;
  gmv: number;
}

export interface GMVByContactMethod {
  contactMethod: string;
  gmv: string; // Viene como string en la respuesta
}

export interface CostByIngredient {
  day: string;
  ingredientId: number;
  ingredientName: string;
  cost: number;
}

export interface StockByDay {
  day: string;
  ingredientId: number;
  ingredientName: string;
  quantity: number;
}

export interface OrdersByDay {
  day: string;
  total_orders: number;
}

export interface LinesByDay {
  day: string;
  total_orders: number;
}

// Tipos para filtros
export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface IngredientFilter {
  ingredientId?: number;
}
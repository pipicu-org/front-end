import api from "./api";
import {
  GMVByDay,
  GPByDay,
  GMVByPaymentMethod,
  GMVByContactMethod,
  CostByIngredient,
  StockByDay,
  OrdersByDay,
  LinesByDay,
  DateRange,
  IngredientFilter
} from "../types/metrics.type";

// Servicios con API real
export const getGMVByDay = async (dateRange: DateRange): Promise<GMVByDay[]> => {
  const response = await api.get(`/metrics/gmv-by-day`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }
  });
  return response.data;
};

export const getGMVByPaymentMethod = async (): Promise<GMVByPaymentMethod[]> => {
  const response = await api.get(`/metrics/gmv-by-payment-method`);
  return response.data;
};

export const getGMVByContactMethod = async (): Promise<GMVByContactMethod[]> => {
  const response = await api.get(`/metrics/gmv-by-contact-method`);
  return response.data;
};

export const getStockByDay = async (
  dateRange: DateRange,
  ingredientFilter?: IngredientFilter
): Promise<StockByDay[]> => {
  const response = await api.get(`/metrics/stock-by-day`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      ingredientId: ingredientFilter?.ingredientId
    }
  });
  return response.data;
};

export const getOrdersByDay = async (dateRange: DateRange): Promise<OrdersByDay[]> => {
  const response = await api.get(`/metrics/orders-by-day`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }
  });
  return response.data;
};

export const getLinesByDay = async (dateRange: DateRange): Promise<LinesByDay[]> => {
  const response = await api.get(`/metrics/lines-by-day`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }
  });
  return response.data;
};

// Servicios mock (datos desde archivos JSON)
export const getGPByDay = async (): Promise<GPByDay[]> => {
  const response = await fetch('/data/gp-by-day.json');
  const data: GPByDay[] = await response.json();
  return data;
};

export const getCostByIngredient = async (
  ingredientFilter?: IngredientFilter
): Promise<CostByIngredient[]> => {
  const response = await fetch('/data/cost-by-ingredient.json');
  const data: CostByIngredient[] = await response.json();

  // Filtrar por ingrediente si se especifica
  const filteredData = ingredientFilter?.ingredientId
    ? data.filter(item => item.ingredientId === ingredientFilter.ingredientId)
    : data;

  return filteredData;
};
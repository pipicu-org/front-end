import api from "./api";
import {
  GMVByDay,
  GPByDay,
  MarginByDay,
  MrgByDay,
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

export const getGPByDay = async (dateRange: DateRange): Promise<GPByDay[]> => {
  const response = await api.get(`/metrics/gross-profit-by-day`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }
  });
  // Convert gp from string to number
  return response.data.map((item: { day: string; gp: string }) => ({
    day: item.day,
    gp: parseFloat(item.gp)
  }));
};

export const getMarginByDay = async (dateRange: DateRange): Promise<MarginByDay[]> => {
  const response = await api.get(`/metrics/margin-by-day`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }
  });
  // Convert margin from string to number
  return response.data.map((item: { day: string; margin: string }) => ({
    day: item.day,
    margin: parseFloat(item.margin)
  }));
};

export const getMrgByDay = async (dateRange: DateRange): Promise<MrgByDay[]> => {
  const response = await api.get(`/metrics/mrg-by-day`, {
    params: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate
    }
  });
  // Convert mrg from string to number
  return response.data.map((item: { day: string; mrg: string }) => ({
    day: item.day,
    mrg: parseFloat(item.mrg)
  }));
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
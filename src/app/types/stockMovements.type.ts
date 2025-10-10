export interface IStockMovement {
  id: number;
  ingredientId: number;
  quantity: string;
  unitId: number;
  stockMovementTypeId: number;
  purchaseItemId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface IStockMovementResponse {
  total: number;
  page: number;
  limit: number;
  data: IStockMovement[];
}
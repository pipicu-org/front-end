export interface IStockMovement {
  id: number;
  ingredient:{
    id:number;
    name:string;
  }
  quantity: string;
  unit:{
    id:number;
    name:string;
  }
  stockMovementType:{
    id:number;
    name:string;
  }
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
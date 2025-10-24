export interface IPurchaseItem {
  id: number;
  purchaseId: number;
  ingredient:{
    name:string;
    id:number;
  }
  cost: string;
  quantity: string;
  unitId: number;
  unitQuantity: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPurchase {
  id: number;
  provider : {
    name: string;
    id: number;
  }
  createdAt: string;
  updatedAt: string;
  purchaseItems: IPurchaseItem[];
}

export interface IGetPurchases {
  totalElements: number,
  totalPages: number,
  currentPage: number,
  pageSize: number,
  hasPrevious: boolean,
  hasNext: boolean,
  purchases: IPurchase[];
}

export interface IPurchaseItemPayload {
  ingredientId: number;
  cost: number;
  quantity: number;
  unitId: number;
  unitQuantity: number;
}

export interface IPurchasePayload {
  providerId: number;
  purchaseItems: IPurchaseItemPayload[];
}
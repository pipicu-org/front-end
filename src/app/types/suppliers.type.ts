export interface ISupplier {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISupplierPayload {
  name: string;
  description: string;
}
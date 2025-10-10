export interface IUnit {
  id: number;
  name: string;
  factor: number;
  createdAt: string;
  updatedAt: string;
}

export interface IUnitPayload {
  name: string;
  factor: number;
}
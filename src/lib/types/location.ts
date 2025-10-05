export type Location = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  name: string;
  latitude: string;
  state?: string;
  district?: string;
  longitude: string;
  radiusKm: number;
};
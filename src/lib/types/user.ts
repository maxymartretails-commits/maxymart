export type User = {
  id: string;
  name: string;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  email: string;
};

export type Address = {
  id: string;
  createdAt: string;   // ISO date string
  updatedAt: string;  
  deleted: boolean;
  userId: string;
  street: string | null;
  latitude: number;
  longitude: number;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
};;

export type LocationResponse = {
  success: boolean;
  message: string;
};
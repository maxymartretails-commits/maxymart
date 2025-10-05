export type Order = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
  items: { name: string; qty: number; price: number }[];
};

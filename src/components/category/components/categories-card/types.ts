import { Product } from "@/lib/types/categories";

export interface CategoriesCardProps {
  products: Product[];
  isProductsFetching: boolean;
}
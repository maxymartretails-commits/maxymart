import { ProductVariant } from "@/lib/types/categories";

export type ProductCardProps = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  discountedPrice?:number;
  quantityText?: string;
  image: string;
  stock?: number;
  variants?: ProductVariant[];
  category?: string;
  variantId?: string;
};
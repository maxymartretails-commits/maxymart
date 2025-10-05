import { ProductVariant } from "@/lib/types/categories";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  variantId?: string;
  variants?: ProductVariant[];
  stock?: number;
  category?: string;
  tags: string[];
  image: string;
};

export type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  relatedProducts?: Product[];
  onAddToCart?: (product: Product, quantity: number) => void;
  onRelatedProductClick?: (product: Product) => void;
};
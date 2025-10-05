export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface ProductQueryParams {
  categoryId?: string;
  limit?: number;
}

export interface Product {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  categoryId: string;
  images: any;
  subCategoryId: string;
  brandId: string;
  price: number;
  variantId: string;
  unit: string;
  unitSize: number;
  stock: number;
  category: Category;
}


export interface Products {
  data: Product[],
  totalCount: number
}

export type ProductVariant = {
  id: string;
  stock: number;
  productId: string;
};


export type lowProduct = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  name: string;
  description: string;
  categoryId: string;
  images: string[];
  subCategoryId: string;
  brandId: string;
  variants: ProductVariant[]
};

export type lowStockRespone = {
  lowStocksProducts: lowProduct[],
  lowStocksProductsCount: number
}
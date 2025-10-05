export type Offers = {
  id: string;
  title: string;
  description?: string;
  type: "PERCENTAGE" | "FLAT";
  discountValue: number;
  categoryId:string;
  brandId:string;
  subCategoryId:string;
  productId:string;
  productVariantId:string;
  maxDiscount?: number;
  minOrderValue?: number;
  couponCode?: string;
  usageLimit?: number;
  usagePerUser?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
};

export type OfferResponse = {
  success: boolean;
  offer: Offers[];
};

export type AddOfferResponse = {
  success: boolean;
  offer: Offers;
}

export type DiscountType = "PERCENTAGE" | "FLAT";

export type Offer = {
  title: string;
  description?: string | null;
  type: DiscountType;
  discountValue: number;
  maxDiscount?: number | null;
  minOrderValue?: number | null;
  couponCode?: string | null;
  usageLimit?: number | null;
  usagePerUser?: number | null;
  startDate: string;  // ISO date string
  endDate: string;    // ISO date string
  isActive: boolean;
};


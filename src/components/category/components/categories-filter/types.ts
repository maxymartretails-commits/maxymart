import { Categories } from "@/lib/types/categories";

export interface CatgoriesFilterProps {
  categoryId?: string | null;
  subCatId?: string;
  setSubCatId?: (value: string) => void;
  setBrandId?: (value: string) => void;
  categoriesData?: { categories: Categories[] };
}
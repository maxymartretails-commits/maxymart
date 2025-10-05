export interface Subcategory {
    id: string;
    name: string;
    subCategoryProductStock?: number;
}

export interface Brand {
    id: string;
    name: string;
    individualBrandStock?: number;
}

export interface FilterSidebarProps {
    search: string;
    setSearch: (val: string) => void;
    filteredSubcategories?: Subcategory[];
    filteredBrands?: Brand[];
    setSubCatId?: (id: string) => void;
    setBrandId?: (id: string) => void;
    currentCategoryImage?: string;
    t: (key: string) => string;
}
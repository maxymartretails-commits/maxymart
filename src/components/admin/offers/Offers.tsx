"use client";

import React, { useState } from "react";

//third-party
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

//slices
import { useGetOffersQuery } from "@/lib/slices/offersApiSlice";

//components
import AddOfferModal from "./add-offer-modal/AddOfferModal";
import ActionsCell from "./action-cell/ActionCell";

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Offers = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { data: offersData } = useGetOffersQuery();
    const columnDefs = [
        { field: "id", sortable: true },
        { field: "createdAt", sortable: true },
        { field: "updatedAt", sortable: true },
        { field: "title", sortable: true },
        { field: "description", sortable: true },
        { field: "type", headerName: "Type", sortable: true },
        { field: "brandId", headerName: "Brand", sortable: true },
        { field: "categoryId", headerName: "Category", sortable: true },
        { field: "productId", headerName: "Product", sortable: true },
        { field: "subCategoryId", headerName: "Sub Category", sortable: true },
        { field: "productVariantId", headerName: "Product Variant", sortable: true },
        { field: "discountValue", sortable: true },
        { field: "maxDiscount", sortable: true },
        { field: "minOrderValue", sortable: true },
        { field: "couponCode", sortable: true },
        { field: "usageLimit", sortable: true },
        { field: "usagePerUser", sortable: true },
        { field: "startDate", sortable: true },
        { field: "endDate", sortable: true },
        { field: "isActive", sortable: true },
        {
            field: "actions",
            headerName: "Actions",
            cellRenderer: ActionsCell,
            sortable: false,
        },
    ];
    return (
        <div className="p-6 bg-white rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-semibold">Offers Management</h2>
                <div className="flex gap-3">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Offers
                    </button>
                </div>
            </div>
            <div
                className="ag-theme-alpine"
                style={{ height: "70vh", width: "100%" }}
            >
                <AgGridReact
                    rowData={offersData?.offer || []}
                    columnDefs={columnDefs as ColDef[]}
                    pagination={true}
                    theme={"legacy"}
                    autoSizeStrategy={{ type: "fitGridWidth" }}
                />
            </div>

            <AddOfferModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default Offers;

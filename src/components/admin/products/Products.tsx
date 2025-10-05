"use client";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule, ColDef } from "ag-grid-community";
import { useGetProductsQuery } from "@/lib/slices/productsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus, faTrash, faUpload } from "@fortawesome/free-solid-svg-icons";
import AddProductModal from "./edit-product-modal/EditProductModal";
import ActionsCell from "./action-cell/ActionCell";

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ProductTable() {
  const {data:productsData} = useGetProductsQuery();
  const [isAddModalOpen,setIsAddModalOpen] = useState(false);
  
  const columnDefs = [
    { field: "id", sortable: true },
    { field:"createdAt",sortable:true},
    { field:"updatedAt",sortable:true},
    { field: "name", headerName: "Product Name", sortable: true },
    { field: "description", sortable: true },
    { field: "images", sortable: true },
    { field: "brandId", sortable: true },
    { field: "subCategoryId", sortable: true },
    { field: "categoryId", sortable: true },
    { field: "price", sortable: true },
    { field: "stock", sortable: true },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: ActionsCell,
      sortable: false,
    }
  ]

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
      <h2 className="text-2xl font-semibold">Product Management</h2>
      <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition" onClick={() => setIsAddModalOpen(true)}>
            <FontAwesomeIcon icon={faPlus} /> Add Product
          </button>
        </div>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "70vh", width: "100%" }}
      >
        <AgGridReact
          rowData={productsData?.data || []}
          columnDefs={columnDefs as ColDef[]}
          pagination={true}
          theme={"legacy"}
        />
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

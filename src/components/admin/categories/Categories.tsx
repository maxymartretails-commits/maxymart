"use client";

import React, { useState } from "react";

//components
import AddEditCategoryModal from "./add-edit-category-modal/AddEditCategoryModal";
import ActionsCell from "./action-cell/ActionCell";

//third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

//constants
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { useGetCategoriesQuery } from "@/lib/slices/categoriesApiSlice";

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Categories = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: categoriesData } = useGetCategoriesQuery();

  const columnDefs = [
    { field: "id", sortable: true },
    { field: "createdAt", sortable: true },
    { field: "updatedAt", sortable: true },
    { field: "name", headerName: "Category Name", sortable: true },
    { field: "description", sortable: true },
    { field: "image", sortable: true },
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
        <h2 className="text-2xl font-semibold">Category Management</h2>
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Add Category
          </button>
        </div>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "70vh", width: "100%" }}
      >
        <AgGridReact
          rowData={categoriesData?.categories || []}
          columnDefs={columnDefs as ColDef[]}
          pagination={true}
          theme={"legacy"}
          autoSizeStrategy={{ type: "fitGridWidth" }}
        />
      </div>

      <AddEditCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default Categories;

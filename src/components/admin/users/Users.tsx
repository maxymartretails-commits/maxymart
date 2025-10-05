"use client";

import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import React from "react";
import { useGetUsersQuery } from "@/lib/slices/userApiSlice";

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Users = () => {
  const { data: usersData } = useGetUsersQuery();
  const columnDefs = [
    { field: "id", sortable: true },
    { field: "createdAt", sortable: true },
    { field: "updatedAt", sortable: true },
    { field: "name", headerName: "Name", sortable: true },
    { field: "email", headerName: "Email", sortable: true },
  ];
  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold">Users Management</h2>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "70vh", width: "100%" }}
      >
        <AgGridReact
          rowData={usersData || []}
          columnDefs={columnDefs as ColDef[]}
          pagination={true}
          theme={"legacy"}
          autoSizeStrategy={{ type: "fitGridWidth" }}
        />
      </div>
    </div>
  );
};

export default Users;

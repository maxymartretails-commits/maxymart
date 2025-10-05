"use client";

import React from "react";

//third-party
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

//slices
import { useGetAllOrdersQuery } from "@/lib/slices/orderApiSlice";

//constants
import { statusColors } from "./constants";

//components
import ActionsCell from "./action-cell/ActionCell";

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

const Orders = () => {
  type Status = keyof typeof statusColors;
  const { data: ordersData } = useGetAllOrdersQuery();

  const columnDefs = [
    { field: "id", sortable: true },
    { field: "createdAt", sortable: true },
    { field: "user.name", sortable: true },
    { field: "gstTotal", sortable: true },
    { headerName: "Sub Total (₹)", field: "subTotal", sortable: true },
    { headerName: "Delivery Fee (₹)", field: "deliveryFee", sortable: true },
    { headerName: "Total (₹)", field: "total", sortable: true },
    { field: "paymentStatus", sortable: true },
    {
      headerName: "Payement Method",
      field: "payments",
      sortable: true,
      valueGetter: (params: any) =>
        params.data.payments?.map((p: any) => p.method).join(", ") || "-",
    },
    {
      headerName: "Status",
      field: "status",
      cellRenderer: (params: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[params.value as Status] || "bg-gray-100 text-gray-800"
            }`}
        >
          {params.value}
        </span>
      ),
    },
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
        <h2 className="text-2xl font-semibold">Order Management</h2>
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: "70vh", width: "100%" }}
      >
        <AgGridReact
          rowData={ordersData?.orders}
          columnDefs={columnDefs as ColDef[]}
          pagination={true}
          theme={"legacy"}
          autoSizeStrategy={{ type: "fitGridWidth" }}
        />
      </div>
    </div>
  );
};

export default Orders;

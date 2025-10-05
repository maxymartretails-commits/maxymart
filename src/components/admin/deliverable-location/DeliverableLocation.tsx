"use client";


import React, { useState } from "react";

//third-party
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AllCommunityModule, ColDef, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

//slices
import { useGetDeliveryZoneQuery } from "@/lib/slices/deliverableZoneApiSlice";

//components
import AddLocationModal from "./add-location-modal/AddLocationModal";
import ActionsCell from "./action-cell/ActionCell";

// Register all community features
ModuleRegistry.registerModules([AllCommunityModule]);

const DeliverableLocation = () => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const { data: deliveryZoneData } = useGetDeliveryZoneQuery();
    const columnDefs = [
        { field: "id", sortable: true },
        { field: "createdAt", sortable: true },
        { field: "updatedAt", sortable: true },
        { field: "name", sortable: true },
        { field: "state", sortable: true },
        { field: "district", sortable: true },
        { field: "latitude", sortable: true },
        { field: "longitude", headerName: "Brand Name", sortable: true },
        { field: "radiusKm", sortable: true },
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
                <h2 className="text-2xl font-semibold">Deliverable Location Management</h2>
                <div className="flex gap-3">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Location
                    </button>
                </div>
            </div>
            <div
                className="ag-theme-alpine"
                style={{ height: "70vh", width: "100%" }}
            >
                <AgGridReact
                    rowData={deliveryZoneData || []}
                    columnDefs={columnDefs as ColDef[]}
                    pagination={true}
                    theme={"legacy"}
                    autoSizeStrategy={{ type: "fitGridWidth" }}
                />
            </div>

            <AddLocationModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    );
};

export default DeliverableLocation;

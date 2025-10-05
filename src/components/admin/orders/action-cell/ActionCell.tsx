"use client";

import { useState } from "react";

//third-party
import { faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomCellRendererProps } from "ag-grid-react";

//components
import Modal from "@/components/Modal";
import OrderDetailsModal from "../order-deatil-modal/OrderDetailModal";
import EditOfferModal from "../edit-offer-modal/EditOfferModal";

function ActionsCell(props: CustomCellRendererProps) {
  //states
  const [isViewModalOpen, setViewIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="h-full flex items-center justify-center gap-2">
      <FontAwesomeIcon
        icon={faEye}
        className="cursor-pointer pr-2"
        onClick={() => setViewIsModalOpen(true)}
      />
      <FontAwesomeIcon
        icon={faEdit}
        className="cursor-pointer"
        onClick={() => setIsEditModalOpen(true)}
      />

      <Modal isOpen={isViewModalOpen} hideCloseIcon={true}>
        <OrderDetailsModal
          isOpen={isViewModalOpen}
          onClose={() => setViewIsModalOpen(false)}
          order={props?.data}
        />
      </Modal>
      <Modal isOpen={isEditModalOpen} hideCloseIcon={true}>
        <EditOfferModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          details={props?.data}
        />
      </Modal>
    </div>
  );
}

export default ActionsCell;

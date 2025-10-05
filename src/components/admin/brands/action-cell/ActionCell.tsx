"use client";

import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomCellRendererProps } from "ag-grid-react";
import { useState } from "react";
import Modal from "@/components/Modal";
import AddEditBrandModal from "../add-edit-brand-modal/AddEditBrandModal";
import DeleteBrandModal from "../delete-brand-modal/DeleteBrandModal";

function ActionsCell(props: CustomCellRendererProps) {
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="h-full flex items-center justify-center gap-2">
      <FontAwesomeIcon
        icon={faEdit}
        className="cursor-pointer pr-2"
        onClick={() => setEditIsModalOpen(true)}
      />
      <FontAwesomeIcon
        icon={faTrash}
        className="cursor-pointer"
        onClick={() => setIsDeleteModalOpen(true)}
      />

      <Modal title="testing" isOpen={isEditModalOpen}>
        <AddEditBrandModal
          isOpen={isEditModalOpen}
          onClose={() => setEditIsModalOpen(false)}
          details={props?.data}
        />
      </Modal>
      <Modal title="testing" isOpen={isDeleteModalOpen}>
        <DeleteBrandModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          details={props?.data}
        />
      </Modal>
    </div>
  );
}

export default ActionsCell;

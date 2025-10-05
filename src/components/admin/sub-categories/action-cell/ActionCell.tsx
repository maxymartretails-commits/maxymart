import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomCellRendererProps } from "ag-grid-react";
import { useState } from "react";
import Modal from "@/components/Modal";
import AddEditSubCategoryModal from "../add-edit-sub-category-modal/AddEditSubCategoryModal";
import DeleteSubCategory from "../delete-sub-category-modal/DeleteSubCategoryModal";

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
        <AddEditSubCategoryModal
          isOpen={isEditModalOpen}
          onClose={() => setEditIsModalOpen(false)}
          details={props?.data}
        />
      </Modal>
      <Modal title="testing" isOpen={isDeleteModalOpen}>
        <DeleteSubCategory
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          details={props?.data}
        />
      </Modal>
    </div>
  );
}

export default ActionsCell;

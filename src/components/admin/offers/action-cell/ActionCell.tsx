"use client";

import { useState } from "react";

//third-party
import { faCircleCheck, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CustomCellRendererProps } from "ag-grid-react";

//components
import Modal from "@/components/Modal";
import AddOfferModal from "../add-offer-modal/AddOfferModal";
import DeleteOfferModal from "../delete-offer-modal/DeleteOfferModal";
import { useActivateOffersMutation } from "@/lib/slices/offersApiSlice";
import toast from "react-hot-toast";

function ActionsCell(props: CustomCellRendererProps) {
  //states
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [active, setActive] = useState(props?.data?.isActive);
  const [activateOffers] = useActivateOffersMutation();

  const handleActive = async () => {
    const payload = {
      isActive: !active
    }
    await activateOffers({ id: props?.data?.id,body:payload }).unwrap().then(() => toast.success(`${active ? "Offer Deactivated successfully" : "Offer Activated Successfully"}`)).catch(() => toast.error("Something went error"))
    setActive(!active)
  }

  return (
    <div className="h-full flex items-center justify-center gap-2">
      <FontAwesomeIcon
        icon={faEdit}
        title="Edit"
        className="cursor-pointer pr-2"
        onClick={() => setEditIsModalOpen(true)}
      />
      <FontAwesomeIcon
        icon={faTrash}
        title="Delete"
        className="cursor-pointer"
        onClick={() => setIsDeleteModalOpen(true)}
      />
      <FontAwesomeIcon className={`cursor-pointer ${active ? "text-green-600" : ""}`} title={`${active ? "Deactive" : "Active"}`} icon={faCircleCheck} onClick={() => handleActive()} />

      <Modal title="testing" isOpen={isEditModalOpen}>
        <AddOfferModal
          isOpen={isEditModalOpen}
          onClose={() => setEditIsModalOpen(false)}
          details={props?.data}
        />
      </Modal>
      <Modal title="testing" isOpen={isDeleteModalOpen}>
        <DeleteOfferModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          details={props?.data}
        />
      </Modal>
    </div>
  );
}

export default ActionsCell;

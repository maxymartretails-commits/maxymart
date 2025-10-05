import React, { useState } from "react";
import AddressEditModal from "./components/address-edit-modal/AddressEditModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

interface AddressListProps {
  addresses: Address[];
  phone: string;
  editAddressId: number | null;
  addressForm: { label: string; address: string; phone: string };
  handleEditAddress: (id: number) => void;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressSave: () => void;
  handleAddressCancel: () => void;
}

interface Address {
  id: string;
  street: string;
  state: string;
  city: string;
  country: string;
  zipCode: string;
}
const AddressList: React.FC<AddressListProps> = ({
  addresses,
  phone,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const t = useTranslations('HomePage.profile');
  const [address, setAddress] = useState<Address>();
  const handleEditAddress = ({ id, street, state, city, country, zipCode }: { id: string, street: string, state: string, city: string, country: string, zipCode: string }) => {
    setAddress({ id, street, state, city, country, zipCode })
    setIsEditModalOpen(true);
  }

  const handleAddAddress = () => {
    setIsEditModalOpen(true);
    setIsAdd(true)
  }
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-2 text-[#181111] flex justify-between items-center gap-2">
        {t(`saved_addresses`)}
        <FontAwesomeIcon icon={faPlus} className="text-[#FFD600] cursor-pointer" onClick={handleAddAddress} />
      </h3>
      <div className="space-y-4 overflow-auto" style={{ height: "calc(100vh - 444px)" }}>
        {addresses?.map((addr) => (
          <div
            key={addr.id}
            className="border rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-[#FFFDE7]"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-2 w-full justify-between">
              <div>
                <div className="font-semibold text-[#b59f00]">{t('home')}</div>
                <div className="text-sm text-[#181111]">{addr.street},{addr.state},{addr.city},{addr.country},{addr.zipCode}</div>
                <div className="text-xs text-gray-600">{phone}</div>
              </div>
              <button
                className="text-xs text-[#b59f00] underline hover:text-[#181111] mt-2 md:mt-0"
                onClick={() => handleEditAddress({ id: addr.id, street: addr.street, state: addr.state, city: addr.city, country: addr.country, zipCode: addr.zipCode })}
              >
                {t('edit')}
              </button>
            </div>
          </div>
        ))}
        <AddressEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} address={address} isAdd={isAdd} setIsAdd={setIsAdd} />
      </div>
    </div>
  )
}

export default AddressList; 
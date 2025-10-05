import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { useGetUserAddressQuery } from "@/lib/slices/userApiSlice";
import { useAppDispatch } from "@/lib/hooks";
import { setLocationData } from "@/lib/slices/userLocationSlice";

export default function LocationDropdown({ handleLocationClick, address, userAddress, hasLocation, locationLoading }: {handleLocationClick: any, address: string, hasLocation: boolean, userAddress: string, locationLoading: boolean }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("Select Location");
  const t = useTranslations('HomePage.navlinks');
  const { data: addressData } = useGetUserAddressQuery();
  const dispatch = useAppDispatch();

  const handleSelect = (address: string,pinCode:string,latitude:number,longitude:number) => {
    setSelectedAddress(address);
    const addresss = 
    dispatch(
      setLocationData({
        address: String(address),
        pincode: String(pinCode),
        latitude: Number(latitude),
        longitude: Number(longitude),
        addressByPincode: false
      })
    );
    setDropdownOpen(false);
  };

  const handleCurrentLocation = async (e: React.MouseEvent<HTMLButtonElement>) => {
    await handleLocationClick();
    setSelectedAddress(address);
  }

  useEffect(() => {
    if ((hasLocation && address) || userAddress) {
      setSelectedAddress(address || userAddress)
    }
  }, [hasLocation, address, userAddress]);


  return (
    <div className="relative">
      {/* Location Button */}
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 shadow-sm border bg-red-600 hover:bg-red-700 text-white"
      >
        <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-white" />
        <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-[200px]">
          {locationLoading ? `${t('getting_location')}...` : selectedAddress}
        </span>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 my-2 ml-[-12px] lg:my-0 lg:ml-0 w-64 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
          {/* Current Selected */}
          <div className="p-3 border-b">
            <p className="text-xs text-gray-500">Delivering To</p>
            <p className="font-medium text-sm">{selectedAddress}</p>
          </div>

          {/* Use My Current Location */}
          <button
            onClick={handleCurrentLocation}
            className="w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-red-50 transition text-sm"
          >
            📍 Use My Current Location
          </button>

          {/* Saved Addresses */}
          <div className="border-t">
            <p className="px-4 py-2 text-xs text-gray-500">Saved Addresses</p>
            {addressData && addressData?.length > 0 ? (
              addressData?.map((addr, idx) => (
                <button
                  key={idx}
                  onClick={() => { const address = addr?.street ? `Others - ${addr?.street || ""},${addr?.city},${addr?.state}` : `Others - ${addr?.city},${addr?.state}`; handleSelect(address,String(addr.zipCode),addr.latitude,addr.longitude,) }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 transition text-sm"
                >
                  {addr?.street ? `Others - ${addr?.street || ""},${addr?.city},${addr?.state}` : `Others - ${addr?.city},${addr?.state}`}
                </button>
              ))
            ) : (
              <p className="px-4 py-2 text-xs text-gray-400">
                No saved addresses
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

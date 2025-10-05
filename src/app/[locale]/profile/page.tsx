"use client";

import { useAuth } from "@/lib/context/authContext";
import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import ProfileCard from "@/components/profile/ProfileCard";
import QuickActions from "@/components/profile/QuickActions";
import OrderHistory from "@/components/profile/OrderHistory";
import AddressList from "@/components/profile/AddressList";
import { useGetUserAddressQuery, useGetUserByIdQuery } from "@/lib/slices/userApiSlice";
import { useTranslations } from "next-intl";

const demoAddresses = [
  {
    id: 1,
    label: "Home",
    address: "123 Main Street, Sector 21, Gurgaon, Haryana, 122001",
    phone: "+91 9876543210",
  },
  {
    id: 2,
    label: "Work",
    address: "456 Office Park, Cyber City, Gurgaon, Haryana, 122002",
    phone: "+91 9123456780",
  },
];

const ProfilePage = () => {
  const { user, isLoggedIn, loading } = useAuth();
  const { data: userData } = useGetUserByIdQuery({ id: user?.id });
  const t = useTranslations('HomePage.profile');

  // Profile edit state
  const [editProfile, setEditProfile] = useState(false);
  const [profileName, setProfileName] = useState(userData?.name || "");
  const [profileUsername, setProfileUsername] = useState(userData?.username || "");
  const [profileEmail, setProfileEmail] = useState(userData?.email || "");

  // Address edit state
  const [addresses, setAddresses] = useState(demoAddresses);
  const { data: addressData } = useGetUserAddressQuery();
  const [editAddressId, setEditAddressId] = useState<number | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    address: "",
    phone: "",
  });

  //actions
  const [activeOptions, setActiveOptions] = useState('orders');

  // Profile edit handlers
  const handleProfileEdit = () => {
    setEditProfile(true);
    setProfileName(user?.name || "");
    setProfileUsername(user?.username || "");
    setProfileEmail(user?.email || "");
  };
  const handleProfileSave = () => {
    // In a real app, save to backend here
    setEditProfile(false);
  };

  // Address edit handlers
  const handleEditAddress = (id: number) => {
    const addr = addresses.find((a) => a.id === id);
    setEditAddressId(id);
    setAddressForm({
      label: addr?.label || "",
      address: addr?.address || "",
      phone: addr?.phone || "",
    });
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };
  const handleAddressSave = () => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === editAddressId ? { ...a, ...addressForm } : a))
    );
    setEditAddressId(null);
    setAddressForm({ label: "", address: "", phone: "" });
  };
  const handleAddressCancel = () => {
    setEditAddressId(null);
    setAddressForm({ label: "", address: "", phone: "" });
  };

  useEffect(() => {
    if (user) {
      setProfileEmail(user?.email),
        setProfileName(user?.name),
        setProfileUsername(user?.username)
    }
  }, [user])

  if (loading) {
    return <div className="p-8" style={{ height: "calc(100vh - 168px)", overflow: "auto" }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="p-8 text-red-600">
        {t('login_required_profile')}
      </div>
    );
  }
  return (
    <div className="pb-12" style={{ height: "calc(100vh - 168px)", overflow: "auto" }}>
      <ProfileCard
        user={userData}
        profileName={profileName}
        setProfileName={setProfileName}
        profileUsername={profileUsername}
        setProfileUsername={setProfileUsername}
        profileEmail={profileEmail}
        setProfileEmail={setProfileEmail}
        editProfile={editProfile}
        setEditProfile={setEditProfile}
        handleProfileEdit={handleProfileEdit}
        handleProfileSave={handleProfileSave}
        signOut={signOut}
      />

      {/* Quick Actions */}
      <QuickActions setActiveOptions={setActiveOptions} />

      {/* Loyalty/Rewards Card */}
      {/* <LoyaltyCard /> */}

      {/* Sections */}
      <div className="max-w-2xl mx-auto mt-8">
        {activeOptions === 'orders' && (
          <OrderHistory />
        )}
        {activeOptions === 'addresses' && (
          <AddressList
            addresses={addressData || []}
            phone={userData?.phoneNumber}
            editAddressId={editAddressId}
            addressForm={addressForm}
            handleEditAddress={handleEditAddress}
            handleAddressChange={handleAddressChange}
            handleAddressSave={handleAddressSave}
            handleAddressCancel={handleAddressCancel}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

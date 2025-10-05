import React, { useState } from "react";
import ProfileEditModal from "./components/profile-edit-modal/ProfileEditModal";
import { useTranslations } from "next-intl";
// import EditProfileModal from "./components/EditProfileModal";

interface ProfileCardProps {
  user: any;
  profileName: string;
  setProfileName: (v: string) => void;
  profileUsername: string;
  setProfileUsername: (v: string) => void;
  profileEmail: string;
  setProfileEmail: (v: string) => void;
  editProfile: boolean;
  setEditProfile: (v: boolean) => void;
  handleProfileEdit: () => void;
  handleProfileSave: () => void;
  signOut: (opts: any) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  profileName,
  profileUsername,
  profileEmail,
  signOut,
}) => {
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const t = useTranslations('HomePage.profile');

  const handleProfileEdit = () => {
    setEditIsModalOpen(true)
  }

  return (
    <div className="bg-gradient-to-r from-[#FFEB3B] to-[#FFF176] rounded-b-3xl shadow-md px-6 pt-10 pb-6 flex flex-col items-center relative">
      <div className="max-w-2xl mx-auto flex justify-end mt-2 px-4 absolute top-4 right-6">
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-full shadow transition"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          {t('log_out')}
        </button>
      </div>
      <img
        src={user?.image || "/window.svg"}
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover mb-3"
      />
      <h2 className="text-2xl font-bold text-[#181111] mb-1">{profileName || 'Guest'}</h2>
      {profileUsername && (
        <div className="text-sm text-[#b59f00] font-semibold mb-1">
          @{profileUsername}
        </div>
      )}
      <p className="text-gray-700 mb-2">{profileEmail}</p>
      <span className="bg-[#fffde7] text-[#b59f00] px-3 py-1 rounded-full text-xs font-semibold shadow">
        {t('regular_user')}
      </span>
      <button
        className="mt-2 text-xs text-[#b59f00] underline hover:text-[#181111]"
        onClick={handleProfileEdit}
      >
        {t('edit_profile')}
      </button>
      <ProfileEditModal user={user} isOpen={isEditModalOpen} onClose={() => setEditIsModalOpen(false)} />
    </div>
  );
};

export default ProfileCard; 
'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { BadgeCheck, UserRound, Star, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileCard() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/users/me');
        if (!res.ok) throw new Error('Failed to fetch user data');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    fetchUser();
  }, []);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;

      try {
        setIsUploading(true);
        const res = await fetch('/api/users/upload-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64String }),
        });

        const data = await res.json();
        if (res.ok) {
          setImage(data?.url);
          toast.success("Profile photo uploaded successfully!");
        } else {
          toast.error(data.error || "Upload failed.");
        }
      } catch (err) {
        toast.error("Something went wrong.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const confirmDelete = () => {
    setImage(null);
    setShowDeleteModal(false);
    toast.success("Profile photo deleted");
  };

  if (!user?.email) {
    return (
      <p className="text-center py-20 text-gray-700">
        No user data found.
      </p>
    );
  }

  return (
    <>
      <div className="relative bg-gradient-to-tl from-[#e7f0ec] via-[#aabec2] to-[#005d6e] rounded-lg p-6 w-full h-50 md:h-110 md:max-w-xs flex flex-col items-center gap-3 md:gap-4 shadow-md">

        {/* Delete Button */}
        {(image || user?.image) && (
          <button
            onClick={() => setShowDeleteModal(true)}
            type="button"
            className="absolute top-2 right-2 cursor-pointer bg-white text-gray-800 rounded-full p-1 shadow hover:bg-gray-100 z-30"
          >
            <X size={16} />
          </button>
        )}

        <div className="w-32 h-32 rounded-full relative bg-gray-300 shadow-lg flex items-center justify-center cursor-pointer">
          {image || user?.image ? (
            <Image
              src={image || user?.image}
              alt="Profile"
              fill
              sizes={32}
              className="object-cover rounded-full"
              priority
            />
          ) : (
            <UserRound size={120} strokeWidth={1} color="#fff" />
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />

          <button
            onClick={triggerFileInput}
            type="button"
            className="absolute cursor-pointer bottom-1 right-1 bg-white text-gray-800 rounded-full p-1 shadow hover:bg-gray-100 transition z-20"
          >
            <Plus size={18} />
          </button>

          {isUploading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm text-gray-700 font-medium">
              Uploading...
            </div>
          )}

          {/* {(user?.subscriptionPlan?.name === 'BUSINESS' || user?.subscriptionPlan?.name === 'PREMIUM') &&
            user?.role !== 'INSTITUTION' && user?.role !== 'SHOP_OWNER' && (
              <div className="absolute bottom-1 right-1 rounded-full p-1 shadow-md z-10">
                <Star
                  size={24}
                  strokeWidth={2}
                  fill={user?.subscriptionPlan?.name === 'PREMIUM' ? '#f0d000' : '#AFAFAF'}
                  color={user?.subscriptionPlan?.name === 'PREMIUM' ? '#f0d000' : '#AFAFAF'}
                />
              </div>
            )} */}
        </div>

        <div className="hidden md:block text-center">
            <h3 className="text-lg font-semibold text-gray-800">Identity Verification</h3>
            <p className="text-sm text-gray-600">
                We verify profiles to ensure trust and authenticity for all users.
            </p>
        </div>


        {(user?.firstName || user?.lastName || user?.role) && (
          <p className="font-semibold text-gray-600">
            {user?.firstName} {user?.lastName} {user?.role ? `- ${user?.role}` : ""}
          </p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl animate-fadeIn max-w-70 md:max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Delete Profile Photo?</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete your profile photo?</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-1 cursor-pointer text-sm rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1 text-sm cursor-pointer rounded bg-red-500 text-white hover:bg-red-600"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

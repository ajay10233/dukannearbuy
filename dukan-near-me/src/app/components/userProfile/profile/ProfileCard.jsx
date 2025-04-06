'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileCard({ user }) {
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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
          // setImage(data.url);
          console.log(data);
          toast.success("Profile photo uploaded successfully!");
        } else {
          console.error("Upload failed:", data.error);
          toast.error(data.error || "Upload failed.");
        }
      } catch (err) {
        console.error("Error uploading:", err);
        toast.error("Something went wrong.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-gradient-to-tl from-[#e7f0ec] via-[#aabec2] to-[#005d6e] rounded-lg p-6 w-full md:max-w-xs flex flex-col items-center gap-4 shadow-md">
      <div className="w-32 h-32 rounded-full relative bg-gray-200 shadow-lg flex items-center justify-center overflow-hidden cursor-pointer">
        {image ? (
          <Image src={`${image}`} alt="Profile" fill className="object-cover" priority />
        ) : (
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
          />
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm text-gray-700 font-medium">
            Uploading...
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-800">Identity Verification</h3>
      <p className="text-sm text-gray-500 text-center">
        We verify profiles to ensure trust and authenticity for all users.
      </p>

      <p className="font-semibold text-gray-600">
        {user.name.split(' ')[0]} - {user.role}
      </p>

      {user.emailConfirmed && user.mobileConfirmed && (
        <div className="text-slate-500 text-sm mt-2 space-y-1 flex flex-col items-center justify-center">
          <p className="flex gap-x-2 items-center">
            <BadgeCheck size={18} color="#ffffff" strokeWidth={2} className="bg-green-500 rounded-full" /> Email Verified
          </p>
          <p className="flex gap-x-2 items-center">
            <BadgeCheck size={18} color="#ffffff" strokeWidth={2} className="bg-green-500 rounded-full" /> Mobile Verified
          </p>
        </div>
      )}
    </div>
  );
}

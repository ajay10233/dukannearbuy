'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { BadgeCheck, UserRound, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileCard() {
  const { data: session } = useSession();

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

  if (!session?.user?.email) {
    return (
      <p className="text-center py-20 text-gray-700">
        No user data found.
      </p>
    );
  }

  return (
    <div className="bg-gradient-to-tl from-[#e7f0ec] via-[#aabec2] to-[#005d6e] rounded-lg p-6 w-full h-110 md:max-w-xs flex flex-col items-center gap-4 shadow-md">
      <div className="w-32 h-32 rounded-full relative bg-gray-300 shadow-lg flex items-center justify-center cursor-pointer">
        {image || session?.user?.image ? (
          <Image
            src={image || session?.user?.image}
            alt="Profile"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <UserRound size={120} strokeWidth={1} color="#fff" />
        )}

        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleImageChange}
        />

        {isUploading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm text-gray-700 font-medium">
            Uploading...
          </div>
        )}

        {(session?.user?.plan === 'business' || session?.user?.plan === 'premium') && (
          <div className="absolute bottom-1 right-1 rounded-full p-1 shadow-md z-10">
            <Star
              size={24}
              strokeWidth={2}
              fill={session?.user?.plan === 'premium' ? '#FFD700' : '#C0C0C0'}
              color={session?.user?.plan === 'premium' ? '#FFD700' : '#C0C0C0'}
            />
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-800">Identity Verification</h3>
      <p className="text-sm text-gray-600 text-center">
        We verify profiles to ensure trust and authenticity for all users.
      </p>

      {(session?.user?.firstName || session?.user?.lastName || session?.user?.role) && (
        <p className="font-semibold text-gray-600">
          {session?.user?.firstName} {session?.user?.lastName} {session?.user?.role ? `- ${session?.user?.role}` : ""}
        </p>
      )}

      {session?.user?.emailConfirmed && session?.user?.mobileConfirmed && (
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

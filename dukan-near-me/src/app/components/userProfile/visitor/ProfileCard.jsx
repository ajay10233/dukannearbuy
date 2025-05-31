'use client';

import Image from 'next/image';
import { UserRound } from 'lucide-react';

export default function ProfileCard({ user }) {
  return (
    <div className="relative bg-gradient-to-tl from-[#e7f0ec] via-[#aabec2] to-[#005d6e] rounded-lg p-6 w-full h-50 md:h-110 md:max-w-xs flex flex-col items-center gap-4 shadow-md">
      <div className="w-32 h-32 rounded-full relative bg-gray-300 shadow-lg flex items-center justify-center">
        {user?.profilePhoto ? (
          <Image
            src={user?.profilePhoto}
            alt="Profile"
            fill
            sizes={32}
            className="object-cover rounded-full"
            priority
          />
        ) : (
          <UserRound size={120} strokeWidth={1} color="#fff" />
        )}
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
  );
}

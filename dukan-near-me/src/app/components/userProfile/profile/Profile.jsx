'use client';

import { BadgeCheck } from 'lucide-react';
import ProfileCard from './ProfileCard';

export default function ProfilePage() {
    
  const user = {
    name: 'Garima',
    joinedYear: 2025,
    role: 'Customer',
    // emailConfirmed: true,
    // mobileConfirmed: true,
    // verified: true,
    reviews: 0,
  };

  return (
    <section className="min-h-screen bg-white pt-13 px-4">
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-6 px-12 py-8">
                <ProfileCard user={user}/>
            <div className="flex-1 px-8">
                <h2 className="text-xl font-bold">Hello, {user.name}</h2>
                <p className="text-sm text-gray-500 mb-4">Joined in {user.joinedYear}</p>
                <button className="border border-gray-600 px-4 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition">
                    Edit Profile
                </button>
                <hr className="my-4 border-gray-200" />

                {user.emailConfirmed && user.mobileConfirmed && (
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <span className="text-xl">
                            <BadgeCheck size={18} color="#ffffff" strokeWidth={2} className='bg-blue-600 rounded-full' />
                        </span>
                            Verified
                    </div>
                )}
            </div>
        </div>
    </section>
  );
}

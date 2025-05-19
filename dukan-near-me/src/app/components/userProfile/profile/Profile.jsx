'use client';

import { useEffect, useState } from 'react';
import { BadgeCheck, Edit } from 'lucide-react';
import ProfileCard from './ProfileCard';
import toast from 'react-hot-toast';
import EditProfile from './EditProfile';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/users/me');
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      console.log("data:", data);

      setUser(data);
    } catch (error) {
      toast.error('Failed to load user data');
      console.error(error);
    } finally {
      setLoading(false);
    }
};

useEffect(() => {
  fetchUser();
}, []);

const handleSuccess = async () => {
  await fetchUser();
  setIsEditing(false);
  setOpen(false);          
  toast.success('Profile updated successfully');
};


  if (loading) return <p className="text-center py-20">Fetching user profile...</p>;
  if (!user) return <p className="text-center py-20 text-gray-700">No user data found.</p>;

  return (
    <section className="relative min-h-screen bg-white pt-13 px-4">
      <div className="flex flex-col md:flex-row gap-x-8 gap-y-6 p-4 md:px-12 md:py-8">
        <ProfileCard user={user}  />
        <div className="flex-1 px-0 md:px-8">
          <div className="flex relative items-center justify-between mb-2 md:mb-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold">
                Hello, {user.firstName || user.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                Joined on{' '}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-GB')
                  : 'N/A'}
              </p>
              <div className="pr-4 py-3 flex items-center gap-1 md:gap-2">
                <span className="text-sm text-gray-700 font-semibold">User Id: </span>
                <p className="text-sm text-gray-600">{user?.username}</p>
              </div>
            </div>

            {/* Small screen icon with modal */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  variant="ghost"
                  size="icon"
                  className="md:hidden absolute top-4 right-4 z-10 text-gray-700"
                >
                  <Edit size={20} className="cursor-pointer transition hover:text-blue-600" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white p-6 rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription />
                </DialogHeader>
                <EditProfile user={user} onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
              </DialogContent>
            </Dialog>

            {/* Desktop edit button */}
            {!isEditing && (
              <button
                className="hidden md:inline-block border border-gray-600 px-4 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Desktop inline editing */}
          {isEditing ? (
            <EditProfile user={user} onCancel={() => setIsEditing(false)} onSuccess={handleSuccess} />
          ) : (
            <>
              <hr className="py-2 md:py-4 border-gray-200" />
              <div className="flex flex-col gap-y-2 md:gap-y-4 px-0 md:px-2">
                {user?.address && typeof user.address === 'object' && (
                  <p className="text-sm md:text-[16px] text-gray-800">
                    <span className="font-semibold text-gray-600">Address:</span>{' '}
                    {Object.values(user.address || {})
                      .filter((val) => val && val.trim() !== '')
                      .join(', ') || 'Not provided'}
                  </p>
                )}
                {user?.age && (
                  <p className="text-sm md:text-[16px] text-gray-800">
                    <span className="font-semibold text-gray-600">Age:</span> {user.age}
                  </p>
                )}
                {user?.gender && (
                  <p className="text-sm md:text-[16px] text-gray-800">
                    <span className="font-semibold text-gray-600">Gender:</span> {user.gender}
                  </p>
                )}
                {user?.email && (
                  <p className="text-sm md:text-[16px] text-gray-800">
                    <span className="font-semibold text-gray-600">Email:</span> {user.email}
                  </p>
                )}
                {user?.phone && (
                  <p className="text-sm md:text-[16px] text-gray-800">
                    <span className="font-semibold text-gray-600">Phone:</span> {user.phone}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
                  <Image
                      src="/nearbuydukan - watermark.png"
                      alt="Watermark"
                      fill size="120"
                      className="object-contain w-17 h-17 md:w-32 md:h-32"
                      priority />
      </div>      

    </section>
  );
}

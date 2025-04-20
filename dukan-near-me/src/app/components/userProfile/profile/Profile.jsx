'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BadgeCheck, Edit } from 'lucide-react';
import ProfileCard from './ProfileCard';
import toast from 'react-hot-toast';
import EditProfile from './EditProfile';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export default function Profile() {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  if (status === 'loading') return <p className="text-center py-20">Fetching user profile...</p>;
  if (!session?.user) return <p className="text-center py-20 text-gray-700">No user data found.</p>;

  return (
    <section className="min-h-screen bg-white pt-13 px-4">
        <div className="flex flex-col md:flex-row gap-x-8 gap-y-6 p-4 md:px-12 md:py-8">
        <ProfileCard />
        <div className="flex-1 px-0 md:px-8">
            <div className="flex relative items-center justify-between mb-2 md:mb-4">
                <div>
                <h2 className="text-lg md:text-xl font-bold">Hello, {session?.user.firstName || session?.user.lastName}</h2>
                <p className="text-sm text-gray-500">
                    Joined on {session?.user?.createdAt ? new Date(session?.user?.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                </p>
                <div className='pr-4 py-3 flex items-center gap-1 md:gap-2'>
                    <span className='text-sm text-gray-700 font-semibold'>User Id: </span>
                    <p className='text-sm text-gray-600'>{session?.user?.username}</p>
                </div>
            </div>

            {/* Small screen icon with modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button
                        variant="ghost"
                        size="icon"
                        className="md:hidden  absolute top-4 right-4 z-10 text-gray-700">
                        <Edit size={20} className='cursor-pointer transition hover:text-blue-600' />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white p-6 rounded-xl shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription/>          
                    </DialogHeader>
                    <EditProfile
                    user={session.user}
                    onCancel={() => setOpen(false)}
                    onSuccess={() => setOpen(false)} />
                </DialogContent>
            </Dialog>

            {/* Desktop button */}
            {!isEditing && (
                <button
                    className="hidden md:inline-block border border-gray-600 px-4 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition"
                    onClick={() => setIsEditing(true)} >
                        Edit Profile
                </button>
            )}
        </div>

          {/* Desktop inline editing */}
          {isEditing ? (
            <EditProfile
              user={session.user}
              onCancel={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
            />
          ) : (
            <>
              <hr className="py-2 md:py-4 border-gray-200" />
              <div className="flex flex-col gap-y-2 md:gap-y- px-0 md:px-2">
                {session?.user?.address && typeof session.user.address === 'object' && (
                  <p className="text-sm md:text-md text-gray-800">
                    <span className="font-semibold text-gray-600">Address:</span>{' '}
                    {Object.values(session.user.address || {})
                      .filter((val) => val && val.trim() !== '')
                      .join(', ') || 'Not provided'}
                  </p>
                )}
                {session?.user.age && (
                  <p className="text-sm md:text-md text-gray-800">
                    <span className="font-semibold text-gray-600">Age:</span> {session.user.age}
                  </p>
                )}
                {session?.user.gender && (
                  <p className="text-sm md:text-md text-gray-800">
                    <span className="font-semibold text-gray-600">Gender:</span> {session.user.gender}
                  </p>
                )}
                {session?.user.email && (
                  <p className="text-sm md:text-md text-gray-800">
                    <span className="font-semibold text-gray-600">Email:</span> {session.user.email}
                  </p>
                )}
                {session?.user.phone && (
                  <p className="text-sm md:text-md text-gray-800">
                    <span className="font-semibold text-gray-600">Phone:</span> {session.user.phone}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

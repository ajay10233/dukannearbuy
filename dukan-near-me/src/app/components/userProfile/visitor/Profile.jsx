'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProfileCard from './ProfileCard';
import toast from 'react-hot-toast';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${params.userId}`);
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setUser(data);
      } catch (error) {
        toast.error('Failed to load user data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.userId]);

  if (loading) return <p className="text-center py-20">Fetching profile...</p>;
  if (!user) return <p className="text-center py-20 text-gray-700">No user data found.</p>;

  return (
    <section className="min-h-screen bg-white pt-13 px-4">
      <div className="flex flex-col md:flex-row gap-x-8 gap-y-6 p-4 md:px-12 md:py-8">
        <ProfileCard user={user} />
        <div className="flex-1 px-0 md:px-8">
          <div className="mb-4">
            <h2 className="text-lg md:text-xl font-bold">
              Hello, {user.firstName || user.lastName}
            </h2>
            <p className="text-sm text-gray-500">
              Joined on {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : 'N/A'}
            </p>
            <div className="pr-4 py-3 flex items-center gap-2">
              <span className="text-sm text-gray-700 font-semibold">User Id:</span>
              <p className="text-sm text-gray-600">{user?.username}</p>
            </div>
          </div>

          <hr className="py-2 md:py-4 border-gray-200" />
          <div className="flex flex-col gap-y-2 md:gap-y-4 px-0 md:px-2">
            {user?.address && typeof user.address === 'object' && (
              <p className="text-sm md:text-[16px] text-gray-800">
                <span className="font-semibold text-gray-600">Address:</span>{' '}
                {Object.values(user.address)
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
        </div>
      </div>
    </section>
  );
}

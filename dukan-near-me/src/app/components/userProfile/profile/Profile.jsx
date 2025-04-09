'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import ProfileCard from './ProfileCard';
import toast from 'react-hot-toast';
import EditProfile from './EditProfile';

export default function Profile() {
    const { data: session, status } = useSession();
    console.log("session:", session);
    console.log("address type:", typeof session?.user?.address);
    console.log("address value:", session?.user?.address);

  const [isEditing, setIsEditing] = useState(false);
  // const [user, setUser] = useState(session?.user);
//   const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(false);       
//   const [error, setError] = useState(null);           

  // useEffect(() => {
    // if (status === 'authenticated') {
    //   fetch('/api/users')
    //     .then(res => {
    //       if (!res.ok) throw new Error('User not found');
    //       return res.json();
    //     })
    //     .then(data => {
    //       setUser(data);
    //       setEditedUser(data);
    //       setLoading(false);
    //     })
    //     .catch(err => {
    //       console.error('Error loading profile:', err);
    //       setError(err.message);
    //       setLoading(false);
    //     });
    // }
  // }, [status]);
    
//   const handleChange = (e) => {
//     setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     try {
//       const response = await fetch('/api/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(editedUser),
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || 'Something went wrong');

//       toast.success('Profile updated!');
//       setUser(editedUser);
//       setIsEditing(false);
//     } catch (error) {
//       toast.error(error.message);
//     }
// };
  
    if (status === 'loading' || loading) return <p className="text-center py-20">Fetching user profile...</p>;
    if (!session?.user) return <p className="text-center py-20 text-gray-700">No user data found.</p>;
  
  return (
    <section className="min-h-screen bg-white pt-13 px-4">
      <div className="flex flex-col md:flex-row gap-x-8 gap-y-6 px-12 py-8">
        <ProfileCard />
        <div className="flex-1 px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Hello, {session?.user.firstName || session?.user.lastName}</h2>
              <p className="text-sm text-gray-500">Joined in {session?.user.createdAt || 2025}</p>
            </div>
            {!isEditing && (
              <button
                className="border border-gray-600 px-4 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                //   setEditedUser(user);
                  setIsEditing(true);
                }}>
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <EditProfile
              user={session.user}
              onCancel={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
            />
          ) : (
            <>
              <hr className="py-4 border-gray-200" />
              <div className="gap-6 space-y-3 px-2">
              {session?.user?.address && typeof session.user.address === 'object' && (
                <p className="text-base text-gray-800 pb-1">
                    <span className="font-semibold text-gray-600">Address:</span>{' '}
                    {Object.values(session.user.address || {})
                    .filter((val) => val && val.trim() !== '')
                    .join(', ') || 'Not provided'}
                </p>
                )}

                {session?.user.age && (
                  <p className="text-base text-gray-800 pb-1">
                    <span className="font-semibold text-gray-600">Age:</span> {session.user.age}
                  </p>
                )}
                {session?.user.gender && (
                  <p className="text-base text-gray-800 pb-1">
                    <span className="font-semibold text-gray-600">Gender:</span> {session.user.gender}
                  </p>
                )}
                {session?.user.email && (
                  <p className="text-base text-gray-800 pb-1">
                    <span className="font-semibold text-gray-600">Email:</span> {session.user.email}
                  </p>
                )}
                {session?.user.phone && (
                    <p className="text-base text-gray-800 pb-1">
                        <span className="font-semibold text-gray-600">Phone:</span> {session.user.phone}
                    </p>
                    )}
              </div>

              {session?.user.emailConfirmed && session?.user.mobileConfirmed && (
                <div className="flex items-center gap-2 text-gray-900 font-medium mt-2">
                  <BadgeCheck
                    size={18}
                    color="#ffffff"
                    strokeWidth={2}
                    className="bg-blue-600 rounded-full"
                  />
                  Verified
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

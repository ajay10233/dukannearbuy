'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import ProfileCard from './ProfileCard';
import toast from 'react-hot-toast';

export default function Profile() {
  const { data: session, status } = useSession();
  console.log("session:", session);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(session?.user);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);       
  const [error, setError] = useState(null);           

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/users')
        .then(res => {
          if (!res.ok) throw new Error('User not found');
          return res.json();
        })
        .then(data => {
          setUser(data);
          setEditedUser(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading profile:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [status]);
    
  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');

      toast.success('Profile updated!');
      setUser(editedUser);
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message);
    }
    };
    
    if (status === 'loading' || loading) return <p className="text-center py-20">Fetching user profile...</p>;
    if (error) return <p className="text-center py-20 text-red-600">{error}</p>;
    if (!user) return <p className="text-center py-20 text-gray-700">No user data found.</p>;
  

  return (
    <section className="min-h-screen bg-white pt-13 px-4">
      <div className="flex flex-col md:flex-row gap-x-8 gap-y-6 px-12 py-8">
        <ProfileCard user={user} />
        <div className="flex-1 px-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">Hello, {user.firstName}</h2>
              <p className="text-sm text-gray-500">Joined in {user.createdAt || 2025}</p>
            </div>
            {!isEditing && (
              <button
                className="border border-gray-600 px-4 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  setEditedUser(user);
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <>
              <div className="grid gap-4 mb-4">
                <input
                  name="address"
                  value={editedUser.address}
                  onChange={handleChange}
                  placeholder="Type your address"
                  className="p-2 border rounded w-full"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="age"
                    value={editedUser.age}
                    onChange={handleChange}
                    placeholder="Age"
                    className="p-2 border rounded"
                  />
                  <div className="flex justify-around items-center gap-4">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={editedUser.gender === 'Male'}
                        onChange={handleChange}
                      />
                      Male
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={editedUser.gender === 'Female'}
                        onChange={handleChange}
                      />
                      Female
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="gender"
                        value="Others"
                        checked={editedUser.gender === 'Others'}
                        onChange={handleChange}
                      />
                      Others
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="email"
                    value={editedUser.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="p-2 border rounded"
                  />
                  <input
                    name="mobile"
                    value={editedUser.mobile}
                    onChange={handleChange}
                    placeholder="Mobile"
                    className="p-2 border rounded"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-1 rounded-md cursor-pointer hover:bg-blue-500 transition"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <hr className="my-4 border-gray-200" />
              <div className="gap-6 space-y-3 px-2">
                {user.address && (
                  <p className="text-base text-gray-800 pb-1">
                    <span className="font-semibold text-gray-600">Address:</span> {user.address}
                  </p>
                )}
                {user.age && (
                  <p className="text-base text-gray-800 pb-1">
                    <span className="font-semibold text-gray-600">Age:</span> {user.age}
                  </p>
                )}
                {user.gender && (
                  <p className="text-base text-gray-800 pb-1">
                    <span className="font-semibold text-gray-600">Gender:</span> {user.gender}
                  </p>
                )}
                {user.email && (
                  <p className="text-base text-gray-800 pb-1">
                    <span className="font-semibold text-gray-600">Email:</span> {user.email}
                  </p>
                )}
                {user.mobile && (
                  <p className="text-base text-gray-800 pb-1">
                    <span className="font-semibold text-gray-600">Mobile:</span> {user.mobile}
                  </p>
                )}
              </div>

              {user.emailConfirmed && user.mobileConfirmed && (
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

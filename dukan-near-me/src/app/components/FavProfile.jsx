"use client";

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function FavProfile() {
  const [favorites, setFavorites] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites');
        const data = await res.json();
        console.log(data.favorites);
        if (res.ok) {
          setFavorites(data.favorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const removeFromFavorites = async (institutionId) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ institutionId }),
      });
  
      if (res.ok) {
        setFavorites((prev) => prev.filter(item => item.institutionId !== institutionId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <section className="w-full h-screen px-4 pt-15 pb-4 bg-gray-50 rounded-lg flex flex-col gap-y-4">
      <div className="text-2xl font-bold text-gray-800 flex items-center gap-2 p-4 justify-center">
        My Favorite Profiles
        <Heart size={20} strokeWidth={1.5} color='#ff0000' fill='#ff0000' />
      </div>

      {/* Header Section */}
      <div className="flex text-sm text-slate-700 font-medium pr-0 md:pr-8 relative z-10 whitespace-nowrap px-2">
        <ul className="flex w-full *:w-2/5  md:*:w-1/5 justify-between relative">
          <li className="hidden md:flex justify-center items-center">S.No</li>
          <li className="flex justify-center items-center">Firm Name</li>
          <li className="flex justify-center items-center">Username</li>
          <li className="hidden md:flex justify-center items-center">Address</li>
          <li className="flex justify-center items-center">Favorite</li>
        </ul>
      </div>

      {/* Scrollable List */}
      {/* <div className="flex flex-col gap-3 h-[60vh] overflow-y-scroll dialogScroll pr-0 md:pr-2"> */}
      <div className="flex flex-col gap-3 h-[60vh]  dialogScroll pr-0 md:pr-2">
        {favorites.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No favorites found</div>
        ) : (
          favorites.map((fav, index) => {
            const institution = fav.institution || {};
            const fullAddress = `${institution?.city || ''}, ${institution?.state || ''}, ${institution?.country || ''}`;

            return (
              <div key={fav.institutionId} className="bg-white p-2 md:p-4 rounded-xl shadow-sm flex items-center w-full">
              <ul className="flex items-center text-sm text-slate-600 w-full justify-between text-center">
                <li className="hidden md:block w-1/5 font-semibold">{index + 1}</li>
            
                <li className="flex w-2/5 md:w-1/5 justify-center items-center">
                  <div className="flex items-center gap-1 md:gap-3">
                    <div className="relative w-8 h-8 md:w-10 md:h-10">
                      <Image
                          // src={institution?.photos?.[0] || "/default-img.jpg"}
                          src={institution?.photos?.length > 0 ? institution.photos[0] : institution?.profilePhoto && institution.profilePhoto !== "null" ? institution.profilePhoto : '/default-img.jpg'}
                        alt="Profile"
                        fill sizes={40}
                        className="rounded-full w-8 h-8 md:w-12 md:h-12 object-cover border border-blue-500" priority
                      />
                    </div>
                    <Link href={`/partnerProfile/${fav.institutionId}`} className="text-blue-600 cursor-pointer text-xs md:text-sm font-semibold">
                      {institution?.firmName || 'Institution Name'}
                    </Link>
                  </div>
                </li>
            
                <li className="w-2/5 md:w-1/5 text-xs md:text-sm">{institution?.username || 'N/A'}</li>
            
                <li className="hidden md:flex w-1/5 justify-center">{fullAddress}</li>
            
                <li className="flex w-2/5 md:w-1/5 justify-center">
                  <button onClick={() => removeFromFavorites(fav.institutionId)}>
                    <Heart
                      size={18}
                      strokeWidth={1.5}
                      stroke="red"
                      fill="red"
                      className="transition-all duration-300 ease-in-out text-xs md:text-sm cursor-pointer hover:scale-110"
                    />
                  </button>
                </li>
              </ul>
            </div>
            
            );
          })
        )}
      </div>
    </section>
  );
}

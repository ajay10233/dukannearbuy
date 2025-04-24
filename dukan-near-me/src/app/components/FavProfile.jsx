// "use client"

// import React, { useEffect, useState } from 'react';
// import { Heart } from 'lucide-react';
// import Link from 'next/link';

// export default function FavProfile() {
//   const [favorites, setFavorites] = useState([]);

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         const res = await fetch('/api/favorites');
//         const data = await res.json();
//         if (res.ok) {
//           setFavorites(data.favorites);
//         }
//       } catch (error) {
//         console.error("Error fetching favorites:", error);
//       }
//     };

//     fetchFavorites();
//   }, []);

//   return (
//     <div>
//       <h2 className="font-semibold text-lg uppercase text-gray-800">Favorites</h2>
//       <ul className="space-y-3">
//         {favorites.map((favorite) => (
//           <li key={favorite.institutionId}>
//             <Link href={`/institutionProfile/${favorite.institutionId}`} className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
//               <Heart size={20} strokeWidth={1.5} className="text-red-500" />
//               Institution {favorite.institutionId}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };


"use client"

import React, { useEffect, useState } from 'react';
import { Heart, Filter, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function FavProfile() {
  const [favorites, setFavorites] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites');
        const data = await res.json();
          if (res.ok) {
            setFavorites(data.favorites)
        };
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);
    

  const removeFromFavorites = async (institutionId) => {
    try {
      const res = await fetch(`/api/favorites/${institutionId}`, { method: 'DELETE' });
      if (res.ok) {
        setFavorites((prev) => prev.filter(item => item.institutionId !== institutionId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <section className="w-full h-screen px-4 pt-15 pb-4 bg-gray-50 rounded-lg flex flex-col gap-y-4">
      <div className="text-2xl font-bold text-gray-800 flex items-center gap-2 p-4 justify-center ">
        My Favorite Profiles
        <Heart size={20} strokeWidth={1.5} color='#ff0000' />
      </div>

      {/* Header Section */}
      <div className="flex text-sm text-slate-400 font-medium pr-8 relative z-10">
        <ul className="flex w-full *:w-1/5 justify-between relative">
          <li className='flex justify-center items-center'>S.No</li>
          <li className='flex justify-center items-center'>Profile</li>
          <li className='flex justify-center items-center'>Username</li>
          <li className='flex justify-center items-center'>Address</li>
          <li className='flex justify-center items-center'>Favorite</li>
        </ul>
      </div>

      {/* Scrollable List */}
      <div className="flex flex-col gap-3 h-[60vh] overflow-y-scroll dialogScroll pr-2">
        {favorites.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">No favorites found</div>
        ) : (
          favorites.map((fav, index) => {
            const user = fav.institutionId || {};
            const fullAddress = `${session?.user?.buildingName || ''}, ${session?.user?.street || ''}, ${session?.user?.city || ''}`;

            return (
              <div key={fav.institutionId} className="bg-white p-4 rounded-xl shadow-sm flex items-center w-full">
                <ul className="flex items-center text-sm text-slate-600 w-full justify-between *:w-1/5 text-center">
                  <li className="font-semibold">{index + 1}</li>
                  <li>
                    <div className="flex items-center gap-3">
                      <img
                        src={session?.user?.profilephoto || " "}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
                      />
                      <Link href={`/partnerProfile/${fav.institutionId}/`} className="text-blue-600 font-semibold hover:underline">
                        {session?.user?.firmName || 'Institution Name'}
                        {/* {session?.user?.subscriptionPlan && (
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full font-medium ml-2">
                            {session?.user?.subscriptionPlan}
                          </span>
                        )} */}
                      </Link>
                    </div>
                  </li>
                  <li>{session?.user?.username}</li>
                  <li>{fullAddress}</li>
                  <li className="flex justify-center">
                    <button onClick={() => removeFromFavorites(fav.institutionId)}>
                      <Heart
                        size={20}
                        strokeWidth={1.5}
                        stroke="red"
                        fill="red"
                        className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-110"
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

"use client"

import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavProfile() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites'); 
        const data = await res.json();
        if (res.ok) {
          setFavorites(data.favorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h2 className="font-semibold text-lg uppercase text-gray-800">Favorites</h2>
      <ul className="space-y-3">
        {favorites.map((favorite) => (
          <li key={favorite.institutionId}>
            <Link href={`/institutionProfile/${favorite.institutionId}`} className="flex items-center gap-2 text-md text-gray-700 hover:text-blue-700 transition duration-200">
              <Heart size={20} strokeWidth={1.5} className="text-red-500" />
              Institution {favorite.institutionId}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};


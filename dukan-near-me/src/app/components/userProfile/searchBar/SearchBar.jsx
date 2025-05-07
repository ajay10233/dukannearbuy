"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";
import { Crown } from "lucide-react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef();

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400); // Delay in ms

    return () => clearTimeout(timer); // Cleanup
  }, [searchQuery]);

  // Fetch data when debouncedQuery updates
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      handleSearch(debouncedQuery);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const handleSearch = async (query) => {
    setLoading(true);
    setResults([]);
    setSuggestions([]);

    try {
      const response = await fetch(`/api/global-search-institutions/?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data.results || []);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRedirect = (profile) => {
    setSuggestions([]);
    setResults([]);
    if (profile.role === "INSTITUTION" || profile.role === "SHOP_OWNER") {
      router.push(`/partnerProfile/${profile.id}`);
    } else {
      router.push(`/userProfile/${profile.id}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestions([]);
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="w-full px-0 md:px-5 flex flex-col gap-y-1 relative">
      <form 
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center border border-gray-500 rounded-md shadow-gray-400 gap-2 overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full py-2 px-3 md:px-4 text-gray-200 text-sm bg-transparent focus:outline-none cursor-pointer"
        />
        <Search size={22} strokeWidth={1.5} color="#afacac" className="mr-4" />
      </form>

      {loading && <p className="text-sm text-gray-500 text-center p-2">Searching...</p>}

      {!loading && suggestions.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-center sm:justify-start mt-2">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(s)}
              className="w-full py-1 px-3 md:py-2 md:px-5 border border-gray-500 text-xs text-gray-300 rounded hover:bg-gray-800 transition-colors duration-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <ul className="w-full z-[1000] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 bg-black border border-gray-500 rounded-md absolute left-1/2 top-full mt-2 transform -translate-x-1/2 ">
          {results.map((profile) => (
            <li
              key={profile.id}
              onClick={() => handleRedirect(profile)}
              className="py-1 px-3 md:py-2 md:px-5 hover:bg-gray-900 transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-8 h-8">
                  <Image
                    src={profile.profilePhoto || (profile.photos?.length > 0 ? profile.photos[0] : '/default-img.jpg')}
                    alt="profile-photo"
                    fill
                    sizes="32px"
                    className="rounded-full object-cover"
                    priority
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200 flex items-center gap-2">
                    {profile?.firmName || profile?.firstName}
                    {profile?.subscriptionPlan?.name === "PREMIUM" && (
                      <Crown size={20} fill="#f0d000" className="text-yellow-500" />
                    )}
                    {profile?.subscriptionPlan?.name === "BUSINESS" && (
                      <Crown size={20} fill="#AFAFAF" className="text-gray-400" />
                    )}
                  </p>
                  <p className="text-xs text-gray-200">
                    {profile.city}, {profile.state} - {profile.zipCode}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && results.length === 0 && searchQuery.trim() !== "" && (
        <p className="text-sm text-gray-500 text-center p-2">No results found</p>
      )}
    </div>
  );
}

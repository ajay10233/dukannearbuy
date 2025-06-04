"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Crown } from "lucide-react";
import Image from "next/image";
import LogoLoader from "../../LogoLoader";
import { useSession } from "next-auth/react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("foryou");
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const { data: session } = useSession();
  const user = session?.user;


  const distanceOptions = [
    { label: "All", value: "All" },
    { label: "5 km", value: "5" },
    { label: "20 km", value: "20" },
    { label: "50 km", value: "50" },
    { label: "100 km", value: "100" },
  ];

  const [selectedDistance, setSelectedDistance] = useState("All");

  const router = useRouter();
  const searchRef = useRef();

  // Tabs for filtering results inside the results dropdown
  const filterTabs = [
    { id: "foryou", label: "For You" },
    { id: "medical", label: "Medical Facility" },
    { id: "shop", label: "Shop" },
    { id: "tags", label: "Tags" },
  ];

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      if (selectedDistance !== "All") {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
            handleSearch(debouncedQuery, latitude, longitude);
          },
          (error) => {
            console.error("Geolocation error:", error);
            handleSearch(debouncedQuery); // fallback without location
          }
        );
      } else {
        handleSearch(debouncedQuery); // no location needed
      }
    }
  }, [selectedDistance]);


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

  const handleSearch = async (query, latitude = null, longitude = null) => {
    setLoading(true);
    setResults([]);
    setSuggestions([]);

    try {
      const params = new URLSearchParams({ search: query });
      console.log("params:", params, "long", longitude, "lat", latitude, "range", selectedDistance);
      if (latitude && longitude && selectedDistance !== "All") {
        params.append("latitude", latitude);
        params.append("longitude", longitude);
        params.append("range", selectedDistance);
      }

      const response = await fetch(`/api/global-search-institutions/?${params.toString()}`);
      const data = await response.json();
      console.log("data:", data);

      const sortedResults = data.results.sort((a, b) => {
        const q = query.toLowerCase();
        const aName = (a.firmName || a.firstName || "").toLowerCase();
        const bName = (b.firmName || b.firstName || "").toLowerCase();
        const aStarts = aName.startsWith(q);
        const bStarts = bName.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aName.localeCompare(bName);
      });

      setResults(sortedResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleRedirect = (profile) => {
    setResults([]);

      // Check if the selected profile is the logged-in user's profile
      if (profile.id === user.id) {
        router.push('/partnerProfile');
        return;
      }

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
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // Filter results based on activeTab logic:
  const filteredResults = results.filter((profile) => {
    if (activeTab === "foryou") {
      return true;

    } else if (activeTab === "medical") {
      return profile.role === "INSTITUTION";

    } else if (activeTab === "shop") {
      return profile.role === "SHOP_OWNER";

    } else if (activeTab === "tags") {
      if (!profile.hashtags || profile.hashtags.length === 0) return false;

      const searchTags = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean);

      return searchTags.some((tag) =>
        profile.hashtags.some((pTag) => pTag.toLowerCase().includes(tag))
      );
    }
    return true;
  });

  return (
    <div
      ref={searchRef}
      className="w-full px-0 md:px-5 flex flex-col gap-y-1 relative"
    >
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center border border-gray-500 hover:border-gray-400 transition-all ease-in-out duration-400 rounded-md  shadow-gray-400 gap-2 overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 px-3 md:px-4 text-gray-200 text-sm bg-transparent focus:outline-none cursor-pointer"
        />
        <Search size={22} strokeWidth={1.5} color="#afacac" className="mr-4" />
      </form>

      {/* {loading && <p className="text-sm text-gray-500 text-center p-2">Searching...</p>} */}
      {loading && <LogoLoader content={"Searching..."} /> }

      {/* Results dropdown */}
      {!loading && results.length > 0 && (
        <div className="w-full z-20 max-h-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 bg-black border border-gray-500 rounded-md absolute left-1/2 top-full mt-2 transform -translate-x-1/2">

          {/* Fixed tabs row */}
          <div className="flex border-b border-gray-600">

            {/* distance range */}
            {results.length > 0 && (
              <div className="flex justify-start p-2">
                <select
                  value={selectedDistance}
                  onChange={(e) => setSelectedDistance(e.target.value)}
                  className="text-sm text-white bg-gray-800 border cursor-pointer border-gray-600 px-3 py-1 rounded-md"
                >
                  {distanceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="cursor-pointer">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* tabs */}
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 text-center text-gray-400 py-2 text-sm cursor-pointer transition-all duration-400 ease-in-out ${activeTab === tab.id
                    ? "bg-white text-gray-800 font-semibold border border-gray-300 shadow"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white border-transparent"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results shown below tabs */}
          <ul className="flex flex-col gap-2 overflow-y-auto dialogScroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-3 max-h-[300px]">
            {filteredResults.length > 0 ? (
              filteredResults.map((profile, i) => (
                <li key={profile.id || i}
                  onClick={() => handleRedirect(profile)}
                  className="py-1 px-3 md:py-2 md:px-5 hover:bg-gray-900 transition-colors duration-300 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="relative w-8 h-8">
                      <Image
                        src={
                          profile?.profilePhoto && profile?.profilePhoto !== "null"
                            ? profile?.profilePhoto
                            : profile.photos?.length > 0
                              ? profile.photos[0]
                              : "/default-img.jpg"
                        }
                        alt="profile-photo"
                        fill
                        sizes="32px"
                        className="rounded-full object-cover"
                        priority
                      />
                    </div>

                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-gray-200 flex items-center gap-1">
                        {profile?.firmName || profile?.firstName}

                        {profile?.subscriptionPlan?.name === "PREMIUM" &&
                          new Date(profile?.planExpiresAt) && (
                            <Crown size={16} fill="#f0d000" className="text-yellow-500" />
                          )}

                        {profile?.subscriptionPlan?.name === "BUSINESS" &&
                          new Date(profile?.planExpiresAt) && (
                            <Crown size={16} fill="#AFAFAF" className="text-gray-400" />
                          )}
                      </p>
                      <p className="text-xs text-gray-200">
                        {profile.city}, {profile.state} - {profile.zipCode}
                      </p>
                      <div className="flex flex-wrap text-xs text-gray-200 gap-1">
                        {profile.hashtags?.map((tag, i) => (
                          <span key={i} className="text-xs text-gray-400 lowercase">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center p-2">No results found</p>
            )}
          </ul>
        </div>
      )}

      {!loading && results.length === 0 && searchQuery.trim() !== "" && (
        <p className="text-sm text-gray-500 text-center p-2">No results found</p>
      )}
    </div>
  );
}

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { Search } from "lucide-react";
// import Image from "next/image";
// import { Crown } from "lucide-react";

// export default function SearchBar() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedQuery, setDebouncedQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);
  
//   const router = useRouter();
//   const searchRef = useRef();

//   // Debounce input
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedQuery(searchQuery);
//     }, 400); // Delay in ms

//     return () => clearTimeout(timer); // Cleanup
//   }, [searchQuery]);

//   // Fetch data when debouncedQuery updates
//   useEffect(() => {
//     if (debouncedQuery.trim() !== "") {
//       handleSearch(debouncedQuery);
//     } else {
//       setResults([]);
//       setSuggestions([]);
//     }
//   }, [debouncedQuery]);

//   const handleSearch = async (query) => {
//     setLoading(true);
//     setResults([]);
//     setSuggestions([]);

//     try {
//       const response = await fetch(`/api/global-search-institutions/?search=${encodeURIComponent(query)}`);
//       const data = await response.json();
//       console.log("data:", data);

//       const sortedResults = data.results.sort((a, b) => {

//         const queryLower = query.toLowerCase();
//         const aName = (a.firmName || a.firstName).toLowerCase();
//         const bName = (b.firmName || b.firstName).toLowerCase();
        
//         // Profiles whose names start with the query should come first
//         const aStartsWith = aName.startsWith(queryLower);
//         const bStartsWith = bName.startsWith(queryLower);

//         if (aStartsWith && !bStartsWith) return -1;
//         if (!aStartsWith && bStartsWith) return 1;
        
//         return aName.localeCompare(bName);
//     });

//     setResults(sortedResults);
//     setSuggestions(data.suggestions || []);

//       setSuggestions(data.suggestions || []);

//     } catch (error) {
//       console.error("Error fetching search results:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   const handleRedirect = (profile) => {
//     setSuggestions([]);
//     setResults([]);
//     if (profile.role === "INSTITUTION" || profile.role === "SHOP_OWNER") {
//       router.push(`/partnerProfile/${profile.id}`);
//     } else {
//       router.push(`/userProfile/${profile.id}`);
//     }
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setSuggestions([]);
//         setResults([]);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div ref={searchRef} className="w-full px-0 md:px-5 flex flex-col gap-y-1 relative">
//       <form
//         onSubmit={(e) => e.preventDefault()}
//         className="flex items-center border border-gray-500 rounded-md shadow-gray-400 gap-2 overflow-hidden"
//       >
//         <input
//           type="text"
//           placeholder="Search..."
//           value={searchQuery}
//           onChange={handleInputChange}
//           className="w-full py-2 px-3 md:px-4 text-gray-200 text-sm bg-transparent focus:outline-none cursor-pointer"
//         />
//         <Search size={22} strokeWidth={1.5} color="#afacac" className="mr-4" />
//       </form>

//       {loading && <p className="text-sm text-gray-500 text-center p-2">Searching...</p>}

//       {/* {!loading && suggestions.length > 0 && (
//         <div className="flex gap-2 flex-wrap justify-center sm:justify-start mt-2">
//           {suggestions.map((s, i) => (
//             <button
//               key={i}
//               onClick={() => setSearchQuery(s)}
//               className="w-full py-1 px-3 md:py-2 md:px-5 border border-gray-500 text-xs text-gray-300 rounded hover:bg-gray-800 transition-colors duration-200"
//             >
//               {s}
//             </button>
//           ))}
//         </div>
//       )} */}

//       {!loading && results.length > 0 && (
//         <ul className="w-full z-[1000] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 bg-black border border-gray-500 rounded-md absolute left-1/2 top-full mt-2 transform -translate-x-1/2 ">
//           {results.map((profile) => (
//             <li
//               key={profile.id}
//               onClick={() => handleRedirect(profile)}
//               className="py-1 px-3 md:py-2 md:px-5 hover:bg-gray-900 transition-colors duration-300 cursor-pointer"
//             >
//               <div className="flex items-center gap-4">
//                 <div className="relative w-8 h-8">
//                   <Image
//                     src={profile?.profilePhoto && profile?.profilePhoto!="null" ? profile?.profilePhoto : (profile.photos?.length > 0 ? profile.photos[0] : '/default-img.jpg')}
//                     // src="/default-img.jpg"
//                     alt="profile-photo"
//                     fill
//                     sizes="32px"
//                     className="rounded-full object-cover"
//                     priority
//                   />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-200 flex items-center gap-2">
//                     {profile?.firmName || profile?.firstName}
//                     {profile?.subscriptionPlan?.name === "PREMIUM" && (
//                       <Crown size={20} fill="#f0d000" className="text-yellow-500" />
//                     )}
//                     {profile?.subscriptionPlan?.name === "BUSINESS" && (
//                       <Crown size={20} fill="#AFAFAF" className="text-gray-400" />
//                     )}
//                   </p>
//                   <p className="text-xs text-gray-200">
//                     {profile.city}, {profile.state} - {profile.zipCode}
//                   </p>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {!loading && results.length === 0 && searchQuery.trim() !== "" && (
//         <p className="text-sm text-gray-500 text-center p-2">No results found</p>
//       )}
//     </div>
//   );
// }





"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Crown } from "lucide-react";
import Image from "next/image";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
   const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("foryou");

  const distanceOptions = [
    { label: "Infinite", value: "infinite" },
    { label: "5 km", value: "5" },
    { label: "20 km", value: "20" },
    { label: "50 km", value: "50" },
    { label: "100 km", value: "100" },
  ];

  const [selectedDistance, setSelectedDistance] = useState("infinite");

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
    handleSearch(debouncedQuery);
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

  const handleSearch = async (query) => {
    setLoading(true);
    setResults([]);
    setSuggestions([]);


    try {
      const response = await fetch(
        `/api/global-search-institutions/?search=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      console.log("data:", data);

      // Sort results to show those starting with query first
      const sortedResults = data.results.sort((a, b) => {
        const q = query.toLowerCase();
        const aName = (a.firmName || a.firstName).toLowerCase();
        const bName = (b.firmName || b.firstName).toLowerCase();

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
      // For You shows all results matching search query
      return true;

    } else if (activeTab === "medical") {
      // Medical Facility: only INSTITUTION role
      return profile.role === "INSTITUTION";

    } else if (activeTab === "shop") {
      // Shop: only SHOP_OWNER role
      return profile.role === "SHOP_OWNER";

    } else if (activeTab === "tags") {
      // Tags: profile must have ALL tags matching the search query words
      if (!profile.hashtags || profile.hashtags.length === 0) return false;

      // split search query into lowercase words
      const searchTags = debouncedQuery.toLowerCase().split(/\s+/).filter(Boolean);

      // Check if all searchTags exist in profile.tags
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
        className="flex items-center border border-gray-500 rounded-md shadow-gray-400 gap-2 overflow-hidden"
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

      {loading && <p className="text-sm text-gray-500 text-center p-2">Searching...</p>}

      {/* {!loading && suggestions.length > 0 && (
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
      )} */}

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
                className={`flex-1 text-center text-gray-400 py-2 text-sm cursor-pointer transition-all duration-400 ease-in-out${
                  activeTab === tab.id
                    ? "bg-gray-700 text-white font-medium"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Results shown below tabs */}
          <ul className="flex flex-col gap-2 overflow-y-auto dialogScroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-3 max-h-[300px]">
            {filteredResults.length > 0 ? (
                filteredResults.map((profile) => (
                    <li key={profile.id}
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
                                      new Date(profile?.subscriptionPlan?.expiresAt) > new Date() && (
                                        <Crown size={16} fill="#f0d000" className="text-yellow-500" />
                                    )}

                                    {profile?.subscriptionPlan?.name === "BUSINESS" &&
                                      new Date(profile?.subscriptionPlan?.expiresAt) > new Date() && (
                                        <Crown size={16} fill="#AFAFAF" className="text-gray-400" />
                                    )}
                                </p>
                                <p className="text-xs text-gray-200">
                                    {profile.city}, {profile.state} - {profile.zipCode}
                                </p>
                                <div className="flex flex-wrap text-xs text-gray-200 gap-1">
                                  {profile.hashtags?.map((tag, i) => (
                                    <span key={i} className="text-xs text-gray-400">#{tag}</span>
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

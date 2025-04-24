// "use client";
// import { useState } from "react";

// export default function GlobalSearchBar() {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     if (!query) return;
//     setLoading(true);
//     try {
//       const res = await fetch(`/api/global-search-institutions?search=${query}`);
//       const data = await res.json();
//       if(res.ok){
//          console.log("Data",data); 
//         }else{
//             console.log("Error",data);
//         }
//       setResults(data);
//     } catch (error) {
//       console.error("Search error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative w-full max-w-lg mx-auto">
//       <input
//         type="text"
//         className="w-full p-2 border border-gray-300 rounded-md"
//         placeholder="Search institutions by address..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//       />
//       {loading && <p className="text-gray-500 mt-1">Searching...</p>}
//       {results.length > 0 && (
//         <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
//           {results.map((institution) => (
//             <li key={institution.id} className="p-2 hover:bg-gray-100">
//               <img src={institution.profilePhoto ?? "/profile.svg"} alt={institution.firmName} className="w-8 h-8 inline-block mr-2 rounded-full" />
//               {institution.firmName} - {institution.city}, {institution.state}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }




"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setResults([]);
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setResults([]);
    setSuggestions([]);

    try {
      const response = await fetch(`/api/global-search-institutions/?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (profileId, role) => {
    if (role === "USER") {
      router.push(`/userProfile/${profileId}`);
    } else if (role === "MEDICAL_INSTITUTE" || role === "SHOP_OWNER") {
      router.push(`/partnerProfile/${profileId}`);
    } else {
      console.warn("Unknown role:", role);
    }
  };

  return (
    <div className="w-full px-0 md:px-5 flex flex-col gap-y-1">
      <form
        onSubmit={handleSearch}
        className="flex items-center border border-gray-500 rounded-md shadow-gray-400 gap-2 overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-2 px-4 text-gray-200 focus:outline-none bg-transparent text-sm cursor-pointer"
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
        />
        <Search size={22} strokeWidth={1.5} color="#afacac" className="mr-4" />
      </form>

      {loading && (
        <p className="text-sm text-gray-500 text-center p-2">Searching...</p>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2 px-1">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(s)}
              className="px-3 py-1 border border-gray-500 text-xs text-gray-300 rounded hover:bg-gray-800 transition-colors duration-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <ul className="w-full bg-black border border-gray-500 rounded-md mt-2">
          {results.map((profile) => (
            <li
              key={profile.id}
              onClick={() => handleRedirect(profile.id, profile.role || "USER")} // Default to USER role if not specified
              className="py-1 px-3 md:py-2 md:px-5 hover:bg-gray-900 transition-colors duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-8 h-8">
                  <Image
                    src={profile.profilePhoto || "/default-profile.png"} // Fallback if no profile photo
                    alt={profile.firmName || "Unknown Firm"}
                    fill
                    sizes="32px"
                    className="rounded-md object-cover"
                    priority
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    {profile.firmName || "Unnamed Institution"}
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

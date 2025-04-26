// "use client";

// import React, { useState } from "react";
// import { Search } from "lucide-react";
// import Image from 'next/image'

// export default function SearchBar() {
//     const [searchQuery, setSearchQuery] = useState("");
//     const [results, setResults] = useState([]);

//     const handleSearch = async (e) => {
//         e.preventDefault();
//         if (!searchQuery.trim()) {
//             setResults([]);
//             return;
//         }

//         try {
//             const response = await fetch(`/api/global-search-institutions/?search=${searchQuery}`);
//             const data = await response.json();
//             setResults(data.length ? data : null);
//         } catch (error) {
//             console.error("Error fetching search results:", error);
//         }
//     };

//     return (
//         <div className="w-full px-0 md:px-5 flex flex-col gap-y-1">
//             <form onSubmit={handleSearch} className="flex items-center border border-gray-500 rounded-md shadow-gray-400 gap-2 overflow-hidden">
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchQuery}
//                     onChange={(e) => {
//                         setSearchQuery(e.target.value);
//                         if (!e.target.value.trim()) setResults([]);
//                     }}
//                     className="w-full py-2 px-4 text-gray-200 focus:outline-none bg-transparent text-sm cursor-pointer"
//                 />
//                 <Search size={22} strokeWidth={1.5} color="#afacac" className="mr-4" />
//             </form>

//             {results !== null && results.length > 0 && (
//                 <ul className="w-full bg-black border border-gray-500 rounded-md">
//                     {results.map((profile) => (
//                         <li key={profile.id} className="py-1 px-3 md:py-2 md:px-5 hover:bg-gray-900 transition-colors duration-300 cursor-pointer">
//                             <div className="flex items-center gap-4">
//                                 <div className="relative w-8 h-8">
//                                     <Image src={profile.profilePhoto} alt={profile.firmName} fill sizes="32px" className="rounded-md" priority/>
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-medium text-gray-200">{profile.firmName}</p>
//                                     <p className="text-xs text-gray-200">
//                                         {profile.city}, {profile.state} - {profile.zipCode}
//                                     </p>
//                                 </div>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             )}

//             {results === null && (
//                 <p className="text-sm text-gray-500 text-center p-2">No results found</p>
//             )}
//         </div>
//     );
// }


"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef();

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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  
    if (value.trim() === "") {
      setResults([]);
      setSuggestions([]);
    }
  };  

    const handleRedirect = (profile) => {
      console.log('Redirecting to:', profile);
      setSuggestions([]);
      setResults([]);

        if (profile.firmName) {
            router.push(`/partnerProfile/${profile.id}`);
        } else {
            router.push(`/userProfile/${profile.id}`);
          }
    }

  return (
    <div ref={searchRef} className="w-full px-0 md:px-5 flex flex-col gap-y-1 relative">
      <form 
        onSubmit={handleSearch}
        className="flex items-center border border-gray-500 rounded-md shadow-gray-400 gap-2 overflow-hidden"
      >
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full py-2 px-3 md:px-4 text-gray-200 text-sm bg-transparent focus:outline-none cursor-pointer"

          // className="w-full py-2 px-4 text-gray-200 focus:outline-none bg-transparent text-sm cursor-pointer"
          onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
        />
        <Search size={22} strokeWidth={1.5} color="#afacac" className="mr-4" />
      </form>

      {loading && (
        <p className="text-sm text-gray-500 text-center p-2">Searching...</p>
      )}

      {!loading && suggestions.length > 0 && (
        // <div className="flex gap-2 flex-wrap mt-2 px-1">
          <div className="flex gap-2 flex-wrap justify-center sm:justify-start mt-2 px-1">

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
        // <ul className="w-[340px] md:w-363 z-1000 bg-black border border-gray-500 rounded-md mt-2 absolute top-9 right-0 md:right-4">
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
                    src={profile.profilePhoto} 
                    alt="profile-photo"
                    fill
                    sizes="32px"
                    className="rounded-md object-cover"
                    priority
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{profile.firmName || profile.firstName}</p>
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

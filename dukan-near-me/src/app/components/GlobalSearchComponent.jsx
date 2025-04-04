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




'use client'

import { useState } from 'react'

export default function GlobalSearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResults([])
    setSuggestions([])

    try {
      const res = await fetch(`/api/global-search-institutions?search=${encodeURIComponent(query)}`)
      const data = await res.json()
      console.log(data);
      setResults(data.results || [])
      setSuggestions(data.suggestions || [])
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search Institutions</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border rounded px-4 py-2 w-full"
          placeholder="Search city, state, zip, firm name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-600">Searching...</p>}

      {!loading && suggestions.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-500">Did you mean:</p>
          <div className="flex gap-2 mt-1 flex-wrap">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setQuery(s)}
                className="px-3 py-1 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 text-sm"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && query.trim() !== '' && (
        <p className="text-gray-500">No results found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {results.map((item) => (
          <div key={item.id} className="border rounded p-4 shadow">
            <h2 className="font-semibold text-lg">{item.firmName || 'Unnamed Institution'}</h2>
            <p className="text-sm text-gray-600">
              {item.city}, {item.state} {item.zipCode}
            </p>
            {item.profilePhoto && (
              <img
                src={item.profilePhoto}
                alt={item.firmName}
                className="w-full h-40 object-cover mt-2 rounded"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

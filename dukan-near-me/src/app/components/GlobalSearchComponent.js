"use client";
import { useState } from "react";

export default function GlobalSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/global-search-institutions?search=${query}`);
      const data = await res.json();
      if(res.ok){
         console.log("Data",data); 
        }else{
            console.log("Error",data);
        }
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-md"
        placeholder="Search institutions by address..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      {loading && <p className="text-gray-500 mt-1">Searching...</p>}
      {results.length > 0 && (
        <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
          {results.map((institution) => (
            <li key={institution.id} className="p-2 hover:bg-gray-100">
              <img src={institution.profilePhoto ?? "/profile.svg"} alt={institution.firmName} className="w-8 h-8 inline-block mr-2 rounded-full" />
              {institution.firmName} - {institution.city}, {institution.state}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import Image from 'next/image'

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setResults([]); 
            return;
        }

        try {
            const response = await fetch(`/api/global-search-institutions/?search=${searchQuery}`);
            const data = await response.json();
            setResults(data.length ? data : null); 
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div className="w-full px-0 md:px-5 flex flex-col gap-y-1">
            <form onSubmit={handleSearch} className="flex items-center border border-gray-500 rounded-md shadow-gray-400 gap-2 overflow-hidden">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!e.target.value.trim()) setResults([]); 
                    }}
                    className="w-full py-2 px-4 text-gray-200 focus:outline-none bg-transparent text-sm cursor-pointer"
                />
                <Search size={22} strokeWidth={1.5} color="#afacac" className="mr-4" />
            </form>

            {results !== null && results.length > 0 && (
                <ul className="w-full bg-black border border-gray-500 rounded-md">
                    {results.map((profile) => (
                        <li key={profile.id} className="py-1 px-3 md:py-2 md:px-5 hover:bg-gray-900 transition-colors duration-300 cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="relative w-8 h-8">
                                    <Image src={profile.profilePhoto} alt={profile.firmName} fill sizes="32px" className="rounded-md" priority/>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-200">{profile.firmName}</p>
                                    <p className="text-xs text-gray-200">
                                        {profile.city}, {profile.state} - {profile.zipCode}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {results === null && (
                <p className="text-sm text-gray-500 text-center p-2">No results found</p>
            )}
        </div>
    );
}

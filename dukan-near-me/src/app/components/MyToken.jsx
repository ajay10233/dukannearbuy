"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function MyToken() {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchTokens = async () => {
      const res = await fetch("/api/token");
      const data = await res.json();
      setTokens(data);
    };
    fetchTokens();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-white via-slate-100 to-slate-200 p-3 md:p-6 relative">
      <div className="w-[310px] md:w-full md:max-w-6xl flex flex-col justify-center gap-6 mx-auto pt-16">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 text-center">
          My Tokens
        </h1>

        <div className="shadow-xl rounded-xl border border-slate-300 bg-white backdrop-blur-sm">
          <table className="w-[310px] md:min-w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gradient-to-r from-blue-700 to-teal-500 text-white">
              <tr className="text-center">
                <th className="px-2 py-3 md:px-6 md:py-4">Token No.</th>
                <th className="px-2 py-3 md:px-6 md:py-4 hidden md:table-cell">Firm Name</th>
                <th className="px-2 py-3 md:px-6 md:py-4">Assigned By</th>
                <th className="px-2 py-3 md:px-6 md:py-4">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
            {tokens.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No token has been assigned yet...
                </td>
              </tr>
            ) : (
              tokens.map((token) => (
                <tr key={token.id} className="hover:bg-slate-100 transition duration-200">
                  <td className="p-3 md:px-6 md:py-4 font-semibold text-blue-700">{token.tokenNumber}</td>
                  <td className="p-3 md:px-6 md:py-4 hidden md:table-cell">{token.institution?.firmName || "N/A"}</td>
                  <td className="p-3 md:px-6 md:py-4">{token.institution?.username || "N/A"}</td>
                  <td className="p-3 md:px-6 md:py-4">{new Date(token.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
        <Image
          src="/nearbuydukan - watermark.png"
          alt="Watermark"
          fill
          className="object-contain w-17 h-17 md:w-32 md:h-32"
          priority
        />
      </div>
    </div>
  );
}

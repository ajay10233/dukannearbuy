"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LogoLoader from "./LogoLoader";


export default function MyToken() {
  const [tokens, setTokens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTokens = async () => {
       try {
          const res = await fetch("/api/token");
          const data = await res.json();
          setTokens(data);
      } catch (error) {
          console.error("Error fetching tokens:", error);
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchTokens();
  }, []);

  if (loading) {
    return <LogoLoader content={"Fetching assigned tokens..."} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-white via-slate-100 to-slate-200 p-3 md:p-6 relative">
      <div className="w-[310px] md:w-full md:max-w-6xl flex flex-col justify-center gap-6 mx-auto pt-16">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 text-center">
          My Tokens
        </h1>

        <div className="shadow-xl rounded-xl border border-slate-300 bg-white backdrop-blur-sm">
          <table className="md:min-w-full flex flex-col justify-start text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gradient-to-r from-blue-700 to-teal-500 text-white">
              <tr className="text-center flex flex-row justify-evenly">
                <th className="px-2 py-3 md:px-6 md:py-4">
                  <button onClick={() => setShowModal(true)} className="text-white cursor-pointer transition-all duration-400 ease-in-out hover:text-yellow-300 text-xl" title="Token Info">
                    <Info size={20} strokeWidth={1.5} />
                  </button>
                </th>
                <th className="px-2 py-3 md:px-6 md:py-4">Token No.</th>
                <th className="px-2 py-3 md:px-6 md:py-4 hidden md:table-cell">Firm Name</th>
                <th className="px-2 py-3 md:px-6 md:py-4">Assigned By</th>
                <th className="px-2 py-3 md:px-6 md:py-4">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center">
            {tokens.length === 0 ? (
              <tr className="flex flex-col justify-center items-center">
                <td colSpan="4" className="text-center py-10 text-gray-500">
                  No token has been assigned yet...
                </td>
              </tr>
            ) : ( 
              tokens.map((token) => (
                <tr key={token.id} className="hover:bg-gray-50 *:w-2/5  transition duration-200 flex flex-row items-center justify-evenly">
                  <td className="p-3 md:px-6 md:py-4 font-semibold text-blue-700">{token.tokenNumber}</td>
                  <td className="p-3 md:px-6 md:py-4 hidden md:table-cell">
                    <Link href={`/partnerProfile/${token.institutionId}`}>
                      {token.institution?.firmName || "N/A"}
                    </Link>
                  </td>
                  <td className="p-3 md:px-6 md:py-4">
                    <Link href={`/partnerProfile/${token.institutionId}`} className="text-blue-600 hover:underline">
                      {token.institution?.username || "N/A"}
                    </Link>
                  </td>
                  <td className="p-3 md:px-6 md:py-4">
                      {new Date(token.createdAt).toLocaleDateString()}<br />
                      {new Date(token.createdAt).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>

        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-11/12 md:w-1/3 p-6 rounded-lg shadow-xl border-4 border-double border-blue-400"
              initial={{ y: "-50%", opacity: 0, scale: 0.8 }}
              animate={{ y: "0", opacity: 1, scale: 1 }}
              exit={{ y: "-50%", opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-700">Token Generation Process</h2>
              <ol className="list-decimal list-inside text-gray-700 space-y-2">
                <li><strong>Generation:</strong> A token is created when a request is initiated.</li>
                <li><strong>Processing:</strong> Token is assigned but under process.</li>
                <li><strong>Completed:</strong> The process is finished and the token is logged.</li>
              </ol>
              <div className="mt-6 text-right">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer transition-all ease-in-out duration-400 hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Watermark */}
      <div className="absolute bottom-0 right-4 w-17 h-17 md:w-32 md:h-32">
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

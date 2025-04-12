"use client"

import { useState, useEffect, useRef } from "react";
import { MoveRight, MoveLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import io from "socket.io-client";
import { useParams } from "next/navigation";


const socket = io("http://localhost:3001");

export default function TokenUpdate() {
    // const [liveToken, setLiveToken] = useState(null);
    // const [previousToken, setPreviousToken] = useState([]);
    // const inputRef = useRef(null); 

    // useEffect(() => {
    //     const fetchLiveToken = async () => {
    //         try {
    //             const res = await fetch("/api/token/update");
    //             const data = await res.json();
    //             if (res.ok) {
    //                 setLiveToken(data.tokenId);
    //             } else {
    //                 toast.error(data.error || "Failed to fetch live token");
    //             }
    //         } catch (err) {
    //             toast.error("Something went wrong");
    //         }
    //     };

    //     fetchLiveToken();
    // }, []);
    
      const { institutionId } = useParams();
      const [currentToken, setCurrentToken] = useState(null);
      const [completedTokens, setCompletedTokens] = useState([]);
    
      useEffect(() => {
        if (!institutionId) return;
    
        socket.emit("joinInstitutionRoom", institutionId);
    
        // ✅ Only update currentToken if a token is marked as processing
        socket.on("processingTokenUpdated", (token) => {
          console.log("🟡 Token is now processing:", token);
          setCurrentToken(token);
        });
    
        // ✅ If currentToken is completed, remove it
        socket.on("completedTokensUpdated", (tokens) => {
          console.log("✅ Completed tokens updated:", tokens);
          setCompletedTokens(tokens);
    
          setCurrentToken((prev) => {
            if (prev && tokens.some(t => t.id === prev.id)) {
              return null;
            }
            return prev;
          });
        });
    
        return () => {
          socket.off("processingTokenUpdated");
          socket.off("completedTokensUpdated");
        };
      }, [institutionId]);
    
    return (
        <section className="flex flex-col items-center h-[calc(100vh-50px)] justify-start px-8 pb-8 pt-16 gap-y-4 bg-white">
            <div className="flex items-center justify-between w-full">
                <Link href="/UserHomePage" className="flex items-center gap-1">
                    <MoveLeft size={20} strokeWidth={1.5} />
                </Link>
                <h2 className="text-2xl font-bold text-gray-700 text-center flex-1">
                    Live Token Update
                </h2>
            </div>

            {/* display live token */}
            <div className="w-full max-w-5xl rounded-xl flex flex-col gap-y-4 border border-gray-400 bg-gray-100 py-4 px-8 md:p-8 shadow-md">
                <div className="flex flex-row gap-3 md:gap-6 items-center justify-between">
                    <label className="text-xl sm:text-3xl font-bold text-teal-900">
                        Live Token Number :
                    </label>
                    {currentToken ? (
                        <div className="border border-dashed border-amber-600 py-2 px-4">
                            <p><span className="font-medium">Token #</span> {currentToken.tokenNumber}</p>
                            <p><span className="font-medium">Status:</span> {currentToken.completed ? '✅ Completed' : currentToken.processing ? '🟡 Processing' : '🕒 Waiting'}</p>
                            {currentToken.name && <p><span className="font-medium">Name:</span> {currentToken.name}</p>}
                            {currentToken.phoneNumber && <p><span className="font-medium">Phone:</span> {currentToken.phoneNumber}</p>}
                        </div>
                        ) : (
                        <p>No token is currently being processed.</p>
                        )}
                            {/* className="w-20 md:w-35 px-3 py-2 text-center border-2 border-dashed border-yellow-500 text-sm md:text-md font-semibold text-slate-700"/> */}
                </div>
                {/* <div>
                    <button className="flex items-center bg-green-300 hover:bg-green-400 cursor-pointer text-black gap-2 font-medium px-6 py-2 rounded-md transition duration-300 ease-in-out"
                        onClick={handleSave}
                        disabled={loading || !liveToken}>
                            {loading ? "Saving..." : "Save"} 
                            <MoveRight size={16} strokeWidth={1.5} />
                    </button>
                </div> */}
            </div>

            {/* Display previous token */}
                <div className="w-full max-w-5xl rounded-xl bg-white p-6 border border-gray-300 shadow-md">
                    <h2 className="text-2xl font-semibold text-teal-900 mb-4">Previous Tokens</h2>
                    <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 dialogScroll">
                        {completedTokens.length === 0 ? (
                            <p>No completed tokens yet.</p>
                        ) : (
                            <ul className="flex flex-col gap-y-2">
                                {completedTokens.map((token) => (
                                <li key={token.id} className="border border-gray-400 px-3 py-2 rounded">
                                    Token #{token.tokenNumber} {token.name && `(${token.name})`}
                                </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                
                

        </section>
    );
}

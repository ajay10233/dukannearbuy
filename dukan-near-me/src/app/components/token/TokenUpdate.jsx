"use client"

import { useState, useEffect } from "react";
import { MoveLeft, Loader, Clock, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import io from "socket.io-client";
import { useParams } from "next/navigation";


const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, { transports: ["websocket"] });;

export default function TokenUpdate() {
    const { institutionId } = useParams();
    const [currentTokens, setCurrentTokens] = useState([]); // Now an array
    const [completedTokens, setCompletedTokens] = useState([]);
    const [selectedToken, setSelectedToken] = useState(null);

    useEffect(() => {
        if (!institutionId) return;

        socket.emit("joinInstitutionRoom", institutionId);

        // 1. Get all processing tokens initially
        socket.emit("getCurrentProcessingTokens", institutionId, (tokens) => {
            console.log("🔄 Initially fetched processing tokens:", tokens);
            setCurrentTokens(tokens || []);
        });

        // 2. Handle newly updated processing token
        socket.on("processingTokenUpdated", (token) => {
            console.log("🟡 Token is now processing:", token);
            setCurrentTokens((prev) => {
                const exists = prev.find((t) => t.id === token.id);
                if (exists) {
                    return prev.map((t) => (t.id === token.id ? token : t));
                } else {
                    return [...prev, token];
                }
            });
        });

        // 3. Handle completed token list update
        socket.on("completedTokensUpdated", (tokens) => {
            console.log("✅ Completed tokens updated:", tokens);
            setCompletedTokens(tokens);

            // Remove completed tokens from processing list
            setCurrentTokens((prev) =>
                prev.filter((token) => !tokens.some((t) => t.id === token.id))
            );
        });

        // Cleanup listeners
        return () => {
            socket.off("processingTokenUpdated");
            socket.off("completedTokensUpdated");
        };
    }, [institutionId]);


    return (
        <section className="flex flex-col items-center h-[calc(100vh-50px)] justify-start px-8 pb-8 pt-16 gap-y-4 bg-white">
            <div className="flex items-center justify-between w-full">
                <Link href="/partnerHome" className="flex items-center gap-1">
                    <MoveLeft size={20} strokeWidth={1.5} />
                </Link>
                <h2 className="text-2xl font-bold text-gray-700 text-center flex-1">
                    Live Token Update
                </h2>
            </div>

            {/* Display all processing tokens */}
            <div className="w-full max-w-5xl rounded-xl flex flex-col gap-y-4 border border-gray-400 bg-gray-100 p-4 md:p-8 shadow-md">
                <div className="flex flex-col gap-4">
                    <label className="text-lg sm:text-3xl font-bold text-teal-800">
                        Live Token Numbers :
                    </label>
                    {currentTokens.length > 0 ? (
                        currentTokens.map((token) => (
                            <div
                                key={token.id}
                                className="border border-dashed border-amber-600 py-2 px-4 text-sm md:text-md rounded-md bg-white"
                            >
                                <p>
                                    <span className="font-medium">Token #</span> {token.tokenNumber}
                                </p>
                                {/* <p>
                                    <span className="font-medium">Status:</span>{" "}
                                    {token.completed
                                        ? "✅ Completed"
                                        : token.processing
                                            ? "🟡 Processing"
                                            : "🕒 Waiting"}
                                </p> */}
                                <p className="flex items-center gap-2">
                    <span>Status:</span>
                    {token.completed ? (
                      <span className="flex items-center gap-1">
                        <Check strokeWidth={1.5} color="#ffffff" className="bg-green-500 w-4 h-4 md:w-5 md:h-5" /> Completed
                      </span>
                    ) : token.processing ? (
                      <span className="flex items-center gap-1 animate-spin-slow">
                        <Loader strokeWidth={1.5} color="#ffffff" className="bg-yellow-500 w-4 h-4 md:w-5 md:h-5" /> Processing
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock strokeWidth={1.5} color="#000" className="w-4 h-4 md:w-5 md:h-5" /> Waiting
                      </span>
                    )}
                  </p>
                                {/* {token?.user?.username && (
                                    <p>
                                        <span className="font-medium">Name:</span> {token.user.username}
                                    </p>
                                )}
                                {token?.user?.mobileNumber && (
                                    <p>
                                        <span className="font-medium">Phone:</span> {token.user.mobileNumber}
                                    </p>
                                )} */}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm md:text-md">No tokens are currently being processed.</p>
                    )}
                </div>
            </div>

            {/* Display previous/completed tokens */}
            <div className="w-full max-w-5xl rounded-xl bg-white p-6 border border-gray-300 shadow-md">
                <h2 className="text-xl md:text-2xl font-semibold text-teal-800 mb-4">
                    Previous Tokens
                </h2>
                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 dialogScroll">
                    {completedTokens.length === 0 ? (
                        <p className="text-sm md:text-md">No completed tokens yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-y-2">
                            {completedTokens.map((token) => (
                                <li
                                    onClick={() => setSelectedToken(token)}
                                    key={token.id}
                                    className="border border-gray-400 px-3 py-2 rounded transition-all duration-500 ease-in-out hover:bg-gray-100 cursor-pointer"
                                >
                                    <p>
                                        <span className="font-medium">Token #</span> {token.tokenNumber}
                                    </p>
                                    {/* {token?.user?.username && (
                                        <p>
                                            <span className="font-medium">Name:</span> {token.user.username}
                                        </p>
                                    )}
                                    {token?.user?.mobileNumber && (
                                        <p>
                                            <span className="font-medium">Phone:</span> {token.user.mobileNumber}
                                        </p>
                                    )} */}
                                </li>
                            ))}

                        </ul>
                    )}
                </div>
            </div>
            {selectedToken && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative">
                    <button
                        onClick={() => setSelectedToken(null)}
                        className="absolute top-2 right-2 text-gray-500 transition-all duration-500 ease-in-out hover:text-red-600 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                    <h3 className="text-lg font-bold mb-2">Token Details</h3>
                    <p><span className="font-medium">Token #</span> {selectedToken.tokenNumber}</p>
                    {selectedToken?.user?.username && (
                        <p><span className="font-medium">Username:</span> {selectedToken.user?.username}</p>
                    )}
                    {selectedToken?.user?.mobileNumber && (
                        <p><span className="font-medium">Phone:</span> {selectedToken.user?.mobileNumber}</p>
                    )}
                    </div>
                </div>
            )}
        </section>
    );
}

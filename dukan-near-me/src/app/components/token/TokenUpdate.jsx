"use client"

import { useState, useEffect, useRef } from "react";
import { MoveRight, MoveLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TokenUpdate() {
    const [liveToken, setLiveToken] = useState(null);
    const [previousToken, setPreviousToken] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null); 

    useEffect(() => {
        const fetchLiveToken = async () => {
            try {
                const res = await fetch("/api/token/update");
                const data = await res.json();
                if (res.ok) {
                    setLiveToken(data.tokenId);
                } else {
                    toast.error(data.error || "Failed to fetch live token");
                }
            } catch (err) {
                toast.error("Something went wrong");
            }
        };

        fetchLiveToken();
    }, []);

    const handleSave = async () => {
        if (!liveToken) return;
    
        try {
            setLoading(true);
    
            const res = await fetch("/api/token/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tokenId: liveToken }),
            });
    
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");
    
            toast.success("Live token updated successfully");
    
            inputRef.current?.focus();
    
            const refresh = await fetch("/api/token/update");
            const latest = await refresh.json();
            if (refresh.ok) {
                // Save the old token as "" only now
                setPreviousToken(prev => [
                    ...prev,
                    { tokenId: liveToken, timestamp: Date.now() }
                ]);
    
                setLiveToken(latest.tokenId);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };
    

    const recentTokens = previousToken.filter(token => Date.now() - token.timestamp <= 3600000)
                                        .sort((a, b) => b.timestamp - a.timestamp);


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
                    <input ref={inputRef} type="text"
                            value={liveToken || ""}
                            placeholder="Enter token number"
                            onChange={(e) => setLiveToken(e.target.value.trim())}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSave(); 
                                }
                            }}
                            className="w-20 md:w-35 px-3 py-2 text-center border-2 border-dashed border-yellow-500 text-sm md:text-md font-semibold text-slate-700"/>
                </div>
                <div>
                    <button className="flex items-center bg-green-300 hover:bg-green-400 cursor-pointer text-black gap-2 font-medium px-6 py-2 rounded-md transition duration-300 ease-in-out"
                        onClick={handleSave}
                        disabled={loading || !liveToken}>
                            {loading ? "Saving..." : "Save"} 
                            <MoveRight size={16} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Display previous token */}
            {recentTokens.length > 0 ? (
                <div className="w-full max-w-5xl rounded-xl bg-white p-6 border border-gray-300 shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Previous Tokens</h2>
                    <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-2 dialogScroll">
                        {recentTokens.map((token, index) => (
                            <div key={index}
                                className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                                <p className="text-lg font-medium text-gray-800">
                                    Token #{token.tokenId}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(token.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-600 p-4 text-lg">
                    No token has been assigned yet.
                </div>                
            )}
        </section>
    );
}

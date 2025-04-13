"use client";

import { useState } from "react";
import { MoveRight, MoveLeft, Scan } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TokenGeneration () {
  const [userInput, setUserInput] = useState("");
  const [tokenNumber, setTokenNumber] = useState("");
  const [latestToken, setLatestToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTokenGeneration = async () => {
    setLoading(true);
    try {
      const payload = { userId: userInput.trim() };

      const res = await fetch("/api/token/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Token creation failed");
      }

      const { tokenNumber, userId: newUserId } = data;

      setTokenNumber(tokenNumber);
      if (!userInput && newUserId) setUserInput(newUserId);
      setLatestToken(tokenNumber);

      setUserInput("");
      setTokenNumber("");

      toast.success(`Token ${tokenNumber} created successfully`);
    } catch (err) {
      console.error("Token creation failed:", err);
      toast.error(err.message || "Token creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center h-[calc(100vh-50px)] justify-start px-8 pb-8 pt-16 gap-y-4 bg-white">
      {/* back button */}
      <div className="flex items-center justify-between w-full">
        <Link href="/UserHomePage" className="flex items-center gap-1">
          <MoveLeft size={20} strokeWidth={1.5} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-700 text-center flex-1">
          Live Token Generation
        </h2>
      </div>

      <div className="w-full max-w-5xl rounded-xl flex flex-col gap-y-4 border border-gray-400 bg-gray-100 py-4 px-8 md:p-8 shadow-md">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <label className="font-bold text-md text-sky-900 w-24">User ID:</label>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="border-2 border-dashed border-yellow-500 p-2 rounded-md w-60 text-center"
              placeholder="Enter UserID"
            />
          </div>
          <div>
            <button
              className="flex items-center bg-emerald-400 hover:bg-emerald-500 cursor-pointer text-black gap-2 font-medium px-6 py-2 rounded-md transition duration-300 ease-in-out"
              onClick={() => toast("Scanner not connected")}
            >
              <Scan size={20} strokeWidth={1.5} color="#ffffff" />
              Scan QR
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <label className="font-bold text-md text-sky-900 w-24">Token No:</label>
            <input
              type="text"
              value={tokenNumber}
                onChange={(e) => setTokenNumber(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleTokenGeneration();
                    }
                }}      
              placeholder="Enter Token number"
              className="border-2 border-dashed border-yellow-500 p-2 rounded-md w-60 text-center bg-gray-100"/>
          </div>
          <div>
            <button
              onClick={handleTokenGeneration}
              disabled={loading}
              className="flex items-center bg-green-300 hover:bg-green-400 cursor-pointer text-black gap-2 font-medium px-6 py-2 rounded-md transition duration-300 ease-in-out">
              {loading ? "Saving..." : "Save"}
              <MoveRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

          {latestToken ? (
            <div className="w-full max-w-5xl rounded-xl bg-white p-6 border border-gray-300 shadow-md">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Previous Allotted Number
                </h2>
                <div className="font-bold text-xl text-gray-800">
                    Token #{String(latestToken).padStart(3, "0")}
                </div>
            </div>
                ) : (
                <div className="text-center text-gray-600 p-4 text-lg">No token generated yet.</div>
        )}

    </section>
  );
}

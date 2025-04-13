"use client";

import { useState, useEffect } from "react";
import { MoveRight, MoveLeft, Scan, Loader, Clock, Check } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';

// export default function TokenGeneration () {
//   const [userInput, setUserInput] = useState("");
//   const [tokenNumber, setTokenNumber] = useState("");
//   const [latestToken, setLatestToken] = useState(null);

//   const handleTokenGeneration = async () => {
//     setLoading(true);
//     try {
//       const payload = { userId: userInput.trim() };

//       const res = await fetch("/api/token/create", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.error || "Token creation failed");
//       }

//       const { tokenNumber, userId: newUserId } = data;

//       setTokenNumber(tokenNumber);
//       if (!userInput && newUserId) setUserInput(newUserId);
//       setLatestToken(tokenNumber);

//       setUserInput("");
//       setTokenNumber("");

//       toast.success(`Token ${tokenNumber} created successfully`);
//     } catch (err) {
//       console.error("Token creation failed:", err);
//       toast.error(err.message || "Token creation failed");
//     } finally {
//       setLoading(false);
//     }
//   };

const socket = io('http://localhost:3001'); 

export default function TokenGeneration() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState('');
  const [tokens, setTokens] = useState([]);
  const institutionId = session?.user?.id;

  const fetchTokens = async () => {
    if (!institutionId) return;
    const res = await axios.get(`/api/token/list?institutionId=${institutionId}`);
    setTokens(res.data);
  };

  const handleCreateToken = async () => {
    if (!userId) return alert('Please enter a user ID');
    try {
      const res = await axios.post('/api/token/create', { userId });
      setUserId('');
      fetchTokens();
      socket.emit('newToken', { institutionId, token: res.data });
    } catch (err) {
      console.error('Error creating token', err);
    }
  };

  const handleStartProcessing = (tokenId) => {
    socket.emit('startProcessing', { institutionId, tokenId });
  };

  const handleComplete = (tokenId) => {
    socket.emit('completeToken', { institutionId, tokenId });
  };

  useEffect(() => {
    if (!institutionId) return;

    fetchTokens();
    socket.emit('joinInstitutionRoom', institutionId);

    socket.on('processingTokenUpdated', fetchTokens);
    socket.on('completedTokensUpdated', fetchTokens);

    return () => {
      socket.off('processingTokenUpdated');
      socket.off('completedTokensUpdated');
    };
  }, [institutionId]);

  if (!institutionId) return <p className="p-16 text-center">Loading...</p>;

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
            <label className="font-bold text-md text-teal-900 w-24">User ID:</label>
            <input
              type="text"
              placeholder="User ID"
              className="border px-3 py-1 rounded"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div>
            <button
              className="flex items-center bg-emerald-400 hover:bg-emerald-500 cursor-pointer text-black gap-2 font-medium px-6 py-2 rounded-md transition duration-300 ease-in-out"
              onClick={() => toast("Scanner not connected")}>
                <Scan size={20} strokeWidth={1.5} color="#ffffff" />
                Scan QR
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* <div className="flex items-center gap-4">
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
          </div> */}
          <div>
            <button
              onClick={handleCreateToken}
              className="flex items-center bg-green-300 hover:bg-green-400 cursor-pointer text-black gap-2 font-medium px-6 py-2 rounded-md transition duration-300 ease-in-out">
               Save <MoveRight size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

            <div className="w-full max-w-5xl rounded-xl bg-white px-8 py-4 border border-gray-300 shadow-md">
                  <h2 className="text-2xl font-semibold text-teal-900 mb-4">
                    Previous Allotted Number
                </h2>
                  <ul className="flex flex-col gap-y-4">
                  {tokens.map((token) => (
                    <li key={token.id} className="border border-gray-400 p-3 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p><strong>Token:</strong> #{token.tokenNumber}</p>
                          <p className="flex items-center gap-2">
                            <span>Status:</span>
                            {token.completed ? (
                              <span className="flex items-center gap-1">
                                <Check size={20} strokeWidth={1.5} color="#ffffff" className="bg-green-500" /> Completed
                              </span>
                            ) : token.processing ? (
                              <span className="flex items-center gap-1 animate-spin-slow">
                                <Loader size={20} strokeWidth={1.5} color="#ffffff" className="bg-yellow-500"/> Processing
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Clock size={20} strokeWidth={1.5} color="#000" /> Waiting
                              </span>
                            )}
                          </p>

                      </div>
                        <div className="flex gap-x-2">
                          {!token.completed && (
                            <>
                              <button
                                onClick={() => handleStartProcessing(token.id)}
                                className="bg-yellow-500 hover:bg-yellow-400 transition duration-300 ease-in-out px-2 py-1 rounded text-white cursor-pointer">
                                Set Processing
                              </button>
                              <button
                                onClick={() => handleComplete(token.id)}
                                className="bg-green-500 hover:bg-green-400 transition duration-300 ease-in-out px-2 py-1 rounded text-white cursor-pointer">
                                Complete
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
            </div>
    </section>
  );
}

"use client";

import { useDebounce } from "@/lib/hooks/useDebounce"; // custom debounce hook or lodash.debounce
import { useState, useEffect, useRef } from "react";
import { MoveRight, MoveLeft, Scan, Loader, Clock, Check } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';
import QRModal from "../modals/QRModal";

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, { transports: ["websocket"] });

export default function TokenGeneration() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState('');
  const [tokens, setTokens] = useState([]);
  const institutionId = session?.user?.id;
  const router = useRouter();

  const handleScanned = (data) => {
    console.log("Raw Data is:", data);

    if (!data) return;

    // Trim to remove whitespace or newline characters
    const cleaned = data.trim().replace(/\/+$/, ""); // removes trailing slashes

    const splitted = cleaned.split("/");
    const userId = splitted[splitted.length - 1];

    console.log("Extracted User ID:", userId);

    if (!userId || userId.length < 5) {
      toast.error("Invalid QR Code data.");
      return;
    }

    setUserId(userId);
    toast.success('Generating token!');

    setTimeout(() => {
      handleCreateToken(userId);
      toast.success('Token generated!');
    }, 1000);
  };


  const fetchTokens = async () => {
    if (!institutionId) return;
    const res = await axios.get(`/api/token/list?institutionId=${institutionId}`);
    setTokens(res.data);
  };

  const handleCreateToken = async (generatedId = null) => {
    let userid = userId;
    if (generatedId != null) {
      userid = generatedId;
    }
    if (!userid) return toast.error('Please enter a user ID');
    try {
      const res = await axios.post('/api/token/create', { userId: userid });
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

  // if (!institutionId) return <p className="p-16 text-center">Loading...</p>;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // use your debounce logic or lodash

  useEffect(() => {
    const fetchUsers = async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return setSearchResults([]);

      setLoadingSearch(true);
      try {
        const res = await axios.get(`/api/users?search=${debouncedSearchTerm}`);
        console.log(res.data)
        setSearchResults(res.data?.data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoadingSearch(false);
      }
    };

    fetchUsers();
  }, [debouncedSearchTerm]);

  const handleUserSelect = (user) => {
    setUserId(user.id);
    setSearchTerm('');
    setSearchResults([]);
    toast.success(`Generating token for ${user.username}`);
    handleCreateToken(user.id);
  };

  return (
    <section className="flex flex-col items-center h-[calc(100vh-50px)] justify-start px-8 pb-8 pt-16 gap-y-4 bg-white">
      {/* back button */}
      <div className="flex items-center justify-between w-full">
        <Link href="/partnerHome" className="flex items-center gap-1">
          <MoveLeft size={20} strokeWidth={1.5} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-700 text-center flex-1">
          Live Token Generation
        </h2>
      </div>

      <div className="w-full max-w-5xl rounded-xl flex flex-col gap-y-4 border border-gray-400 bg-gray-100 py-4 px-4 md:p-8 shadow-md">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex flex-col w-full md:w-1/2 relative">
            <label className="font-bold text-md text-teal-800 mb-1">Search by Username</label>
            <input
              type="text"
              className="border px-3 py-2 rounded-md w-full"
              placeholder="Type a username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loadingSearch && <p className="text-sm text-gray-500 mt-1">Searching...</p>}
            {searchResults.length > 0 && (
              <ul className="absolute top-20 z-10 w-full bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleUserSelect(user)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <p className="font-medium text-gray-700">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email || user.mobileNumber || "No contact info"}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* <div>
            <button
              className="flex items-center bg-emerald-400 hover:bg-emerald-500 cursor-pointer text-black gap-2 font-medium px-6 py-2 rounded-md transition duration-300 ease-in-out"
              onClick={() => toast("Scanner not connected")}>
                <Scan size={20} strokeWidth={1.5} color="#ffffff" />
                Scan QR
            </button>
          </div> */}
        </div>

        <div className="flex justify-between items-center gap-4">
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
              className="flex items-center bg-green-300 hover:bg-green-400 cursor-pointer text-sm md:text-md text-black gap-2 font-medium px-4 md:px-6 py-2 rounded-md transition duration-300 ease-in-out">
              Save <MoveRight size={16} strokeWidth={1.5} />
            </button>
          </div>
          <div>
            {/* <button
              className="flex items-center whitespace-nowrap bg-emerald-400 hover:bg-emerald-500 cursor-pointer text-sm md:text-md text-black gap-2 font-medium px-4 md:px-6 py-2 rounded-md transition duration-300 ease-in-out"
              onClick={() => router.push('/scan-qr')}>
              <Scan size={20} strokeWidth={1.5} color="#ffffff" />
              Scan QR
            </button> */}
            {/* <button
              className="flex items-center whitespace-nowrap bg-emerald-400 hover:bg-emerald-500 cursor-pointer text-sm md:text-md text-black gap-2 font-medium px-4 md:px-6 py-2 rounded-md transition duration-300 ease-in-out"
              onClick={() => setOpen(true)}
            >
              <Scan size={20} strokeWidth={1.5} color="#ffffff" />
              Scan QR
            </button> */}

            <QRModal onScanned={handleScanned} />
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl rounded-xl bg-white px-6 py-4 border border-gray-300 shadow-md">
        <h2 className="text-xl md:text-2xl font-semibold text-teal-800 mb-4">
          Previous Allotted Number
        </h2>
        <ul className="flex flex-col gap-y-4">
          {tokens.map((token) => (
            <li key={token.id} className="border border-gray-400 p-3 rounded text-sm md:text-md">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Token:</strong> #{token.tokenNumber}</p>
                  {token.user && (
                    <>
                      <p><strong>Username:</strong> {token.user.username || 'N/A'}</p>
                      <p><strong>Mobile:</strong> {token.user.mobileNumber || 'N/A'}</p>
                    </>
                  )}
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
                </div>

                <div className="flex gap-x-2">
                  {!token.completed && (
                    <>
                      <button
                        onClick={() => handleStartProcessing(token.id)}
                        className="bg-yellow-500 hover:bg-yellow-400 transition duration-300 ease-in-out p-1 md:px-2 md:py-1 rounded text-white cursor-pointer flex items-center justify-center gap-1">
                        <Loader size={16} className="md:hidden" />
                        <span className="hidden md:inline">Set Processing</span>
                      </button>

                      <button
                        onClick={() => handleComplete(token.id)}
                        className="bg-green-500 hover:bg-green-400 transition duration-300 ease-in-out p-1 md:px-2 md:py-1 rounded text-white cursor-pointer flex items-center justify-center gap-1">
                        <Check size={16} className="md:hidden" />
                        <span className="hidden md:inline">Complete</span>
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

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import io from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, { transports: ["websocket"] });

export default function CreateToken() {
  const { data: session } = useSession();
  const [userId, setUserId] = useState('');
  const [tokens, setTokens] = useState([]);
  const institutionId = session?.user?.id;

  const fetchTokens = async () => {
    if (!institutionId) return;
    try {
      const res = await axios.get(`/api/token/list?institutionId=${institutionId}`);
      setTokens(res.data);
    } catch (error) {
      toast.error('Failed to fetch tokens');
      console.error(error);
    }
  };

  const handleCreateToken = async () => {
    if (!userId) {
      toast.error('Please enter a user ID');
      return;
    }

    try {
      const res = await axios.post('/api/token/create', { userId });
      setUserId('');
      fetchTokens();
      toast.success('Token created successfully');
      socket.emit('newToken', { institutionId, token: res.data });
    } catch (err) {
      console.error('Error creating token', err);
      const message = err?.response?.data?.error || 'Failed to create token';
      toast.error(message);
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

  if (!institutionId) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Token</h1>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="User ID"
          className="border px-3 py-1 rounded"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button
          onClick={handleCreateToken}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Create Token
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-4">All Tokens</h2>
      <ul className="space-y-3">
        {tokens.map((token) => (
          <li key={token.id} className="border p-3 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <p><strong>Token:</strong> #{token.tokenNumber}</p>
                <p>Status: {token.completed ? '✅ Completed' : token.processing ? '🟡 Processing' : '🕒 Waiting'}</p>
              </div>
              <div className="space-x-2">
                {!token.completed && (
                  <>
                    <button
                      onClick={() => handleStartProcessing(token.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Set Processing
                    </button>
                    <button
                      onClick={() => handleComplete(token.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
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
  );
}

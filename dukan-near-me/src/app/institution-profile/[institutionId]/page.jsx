"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "next/navigation";

const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, { transports: ["websocket"] });;

export default function InstitutionProfile() {
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Institution Profile</h1>

      <div className="border p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">🔄 Currently Processing Token</h2>
        {currentToken ? (
          <div>
            <p><strong>Token #</strong> {currentToken.tokenNumber}</p>
            <p><strong>Status:</strong> {currentToken.completed ? '✅ Completed' : currentToken.processing ? '🟡 Processing' : '🕒 Waiting'}</p>
            {currentToken.name && <p><strong>Name:</strong> {currentToken.name}</p>}
            {currentToken.phoneNumber && <p><strong>Phone:</strong> {currentToken.phoneNumber}</p>}
          </div>
        ) : (
          <p>No token is currently being processed.</p>
        )}
      </div>

      <div className="border p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">✅ Last 10 Completed Tokens</h3>
        {completedTokens.length === 0 ? (
          <p>No completed tokens yet.</p>
        ) : (
          <ul className="space-y-2">
            {completedTokens.map((token) => (
              <li key={token.id} className="border px-3 py-2 rounded">
                Token #{token.tokenNumber} {token.name && `(${token.name})`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

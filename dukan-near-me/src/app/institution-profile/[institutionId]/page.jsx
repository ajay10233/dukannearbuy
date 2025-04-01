"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useParams } from "next/navigation";

const socket = io("http://localhost:3001"); 

export default function InstitutionProfile() {
  const { institutionId } = useParams();  
  const [currentToken, setCurrentToken] = useState(null);
  const [completedTokens, setCompletedTokens] = useState([]);

  useEffect(() => {
    if (!institutionId) return;

    socket.emit("joinInstitutionRoom", institutionId);

    socket.on("tokenUpdated", (data) => {
      console.log("Token updated:", data);
      setCurrentToken(data?.newToken);
    });

    socket.on("completedTokensUpdated", (tokens) => {
      console.log("Completed tokens updated:", tokens);
      setCompletedTokens(tokens);
    });

    return () => {
      socket.off("tokenUpdated");
      socket.off("completedTokensUpdated");
    };
  }, [institutionId]);

  return (
    <div>
      <h1>Institution Profile</h1>
      <h2>Current Token: {currentToken ? currentToken.tokenNumber : "None"}</h2>

      <h3>Completed Tokens:</h3>
      <ul>
        {completedTokens.map((token) => (
          <li key={token.id}>Token {token.tokenNumber}</li>
        ))}
      </ul>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatPartners, setChatPartners] = useState([]); // Stores users or institutions
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [socket, setSocket] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);

    newSocket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!session) return;

    const fetchChatPartners = async () => {
      try {
        let endpoint =
          session.user.role === "user" ? "/api/institutions" : "/api/users";
        const res = await fetch(endpoint);
        const data = await res.json();
        setChatPartners(data.data);
      } catch (error) {
        console.error("Failed to fetch chat partners", error);
      }
    };

    fetchChatPartners();
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>You must be logged in to access chat.</p>;

  const sendMessage = () => {
    if (message.trim() && socket && selectedPartner) {
      socket.emit("sendMessage", {
        senderId: session.user.id,
        receiverId: selectedPartner.id,
        message,
      });
      setMessage("");
    }
  };

  return (
    <div>
      <h2>
        Chat with {session.user.role === "user" ? "Institutions" : "Users"}
      </h2>

      {/* List of Available Chat Partners */}
      <div>
        <h3>Select a Chat Partner:</h3>
        {chatPartners.length > 0 &&
          chatPartners.map((partner) => (
            <button key={partner.id} onClick={() => setSelectedPartner(partner)}>
              {partner.name}
            </button>
          ))}
      </div>

      {/* Chat Box */}
      {selectedPartner && (
        <div>
          <h3>Chat with {selectedPartner.name}</h3>
          <div>
            {messages
              .filter((msg) => msg.receiverId === selectedPartner.id)
              .map((msg, index) => (
                <p key={index}>{msg.message}</p>
              ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

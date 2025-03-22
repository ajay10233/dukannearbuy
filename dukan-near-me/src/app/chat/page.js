"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatPartners, setChatPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const socketRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!session || socketRef.current) return;

    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      console.log(`✅ Connected with socket ID: ${socketRef.current.id}`);
      socketRef.current.emit("register", session.user.id);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      if (msg.senderId === session.user.id) return;
      if (msg.senderId == selectedPartner?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [session, selectedPartner]);

  useEffect(() => {
    if (!session) return;
    const fetchChatPartners = async () => {
      try {
        const endpoint = session.user.role === "USER" ? "/api/institutions" : "/api/users";
        const res = await fetch(endpoint);
        const data = await res.json();
        setChatPartners(data.data);
      } catch (error) {
        console.error("❌ Failed to fetch chat partners:", error);
      }
    };

    fetchChatPartners();
  }, [session]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedPartner) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/conversation?receiverId=${selectedPartner.id}`);
        const data = await res.json();
        setMessages(data.data || []);
      } catch (error) {
        console.error("❌ Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedPartner]);

  if (status === "loading") return <p className="text-center text-gray-500">Loading...</p>;
  if (!session) return <p className="text-center text-red-500">You must be logged in to access chat.</p>;

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current || !selectedPartner) return;

    const msgData = {
      senderId: session.user.id,
      receiverId: selectedPartner.id,
      content: message,
      SenderType: session.user.role
    };

    socketRef.current.emit("sendMessage", msgData);
    setMessages((prev) => [...prev, msgData]); // Optimistic UI update
    setMessage("");
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar - Chat Partners */}
      <div className="w-full md:w-1/4 bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Chat with {session.user.role === "USER" ? "Institutions" : "Users"}
        </h2>
        <div className="space-y-2">
          {chatPartners.length > 0 ? (
            chatPartners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedPartner({ ...partner })}
                className={`w-full text-left px-4 text-black py-2 rounded-md transition ${
                  selectedPartner?.id === partner.id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {partner.firstName || partner.name || "Unknown"}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No chat partners available</p>
          )}
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-full md:w-3/4 flex flex-col h-full p-4">
        {selectedPartner ? (
          <>
            {/* Chat Header with Payment Buttons */}
            <div className="bg-white p-3 rounded-md shadow-md mb-2 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Chat with {selectedPartner.name || selectedPartner.firstName || "Unknown"}
              </h3>

              <div className="flex space-x-2">
                {/* View Payment History Button */}
                <button
                  onClick={() => router.push(`/payments/history?receiverId=${selectedPartner.id}`)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  View Payment History
                </button>

                {/* Show "Create Payment" button only for Institutions */}
                {/* {session.user.role === "INSTITUTION" && (
                  <button
                    onClick={() => router.push(`/payments/create?receiverId=${selectedPartner.id}`)}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Create Payment
                  </button>
                )} */}
              </div>
            </div>

            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md shadow-md">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    ref={index === messages.length - 1 ? messagesEndRef : null}
                    className={`p-2 my-2 w-fit max-w-[70%] rounded-md ${
                      msg?.senderId === session.user.id ? "ml-auto bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    <strong>{msg?.senderId === session.user.id ? "You" : selectedPartner.firstName}:</strong> {msg?.content}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No messages yet.</p>
              )}
            </div>

            {/* Message Input */}
            <div className="flex items-center bg-white text-black p-2 rounded-md shadow-md mt-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                Send
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Select a chat partner to start chatting.</p>
        )}
      </div>
    </div>
  );
}

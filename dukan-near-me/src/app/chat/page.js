"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session || socketRef.current) return;

    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      console.log(`✅ Connected with socket ID: ${socketRef.current.id}`);
      socketRef.current.emit("register", session.user.id);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      if (msg.receiverId === session.user.id && msg.conversationId === selectedPartner?.conversationId) {
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

    const fetchConversations = async () => {
      try {
        const res = await fetch(`/api/conversations/all`);
        const data = await res.json();
        setConversations(data.data);
        setFilteredConversations(data.data);
      } catch (error) {
        console.error("❌ Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, [session]);

  useEffect(() => {
    if (!selectedPartner) return;

    console.log("Selected partner:", selectedPartner);

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/conversation?conversationId=${selectedPartner.id}`);
        const data = await res.json();
        setMessages(data?.data?.messages || []);
      } catch (error) {
        console.error("❌ Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedPartner]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    try {
      const res = await fetch(`/api/users/search?query=${query}`);
      const data = await res.json();
      setFilteredConversations(data.data);
    } catch (error) {
      console.error("❌ Search failed:", error);
    }
  };

  if (status === "loading") return <p className="text-center text-gray-500">Loading...</p>;
  if (!session) return <p className="text-center text-red-500">You must be logged in to access chat.</p>;

  const sendMessage = () => {
    if (!message.trim() || !socketRef.current || !selectedPartner) return;

    const msgData = {
      senderId: session.user.id,
      senderType: session.user.role,
      conversationId: selectedPartner.id,
      content: message,
      // conversationId: selectedPartner.conversationId,
    };
    console.log("msg data: ",msgData);
    socketRef.current.emit("sendMessage", msgData);
    setMessages((prev) => (Array.isArray(prev) ? [...prev, msgData] : [msgData]));// Optimistic UI update
    setMessage("");
  };

  return (
    <div className="flex flex-col text-black md:flex-row h-screen bg-gray-100">
      {/* Sidebar - Conversations */}
      <div className="w-full md:w-1/4 bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Conversations</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search users or institutions..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
        />

        <div className="space-y-2">
          {filteredConversations?.length > 0 ? (
            filteredConversations.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelectedPartner({ ...partner })}
                className={`w-full text-left px-4 text-black py-2 rounded-md transition ${
                  selectedPartner?.id === partner.id ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {partner.firmName || partner.firstName || "Unknown"}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No conversations found</p>
          )}
        </div>
      </div>

      {/* Chat Box */}
      <div className="w-full md:w-3/4 flex flex-col h-full p-4">
        {selectedPartner ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-3 rounded-md shadow-md mb-2 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Chat with {selectedPartner.firmName || selectedPartner.firstName || "Unknown"}
              </h3>

              <div className="flex space-x-2">
                {/* View Payment History */}
                <button
                  onClick={() => router.push(`/payments/history?receiverId=${selectedPartner.id}`)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                >
                  View Payment History
                </button>
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
                      msg.senderId === session.user.id ? "ml-auto bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    <strong>{msg.senderId === session.user.id ? "You" : selectedPartner.firstName}:</strong> {msg.content}
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
          <p className="text-center text-gray-500">Select a conversation to start chatting.</p>
        )}
      </div>
    </div>
  );
}

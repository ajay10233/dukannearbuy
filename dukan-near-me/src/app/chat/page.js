"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatPartners, setChatPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [socket, setSocket] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session) return;

    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    console.log(session);
    newSocket.emit("register", session.user.id);
    newSocket.on("receiveMessage", (msg) => {
      console.log("New message received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, [session]);

  useEffect(() => {
    if (!session) return;

    const fetchChatPartners = async () => {
      try {
        let endpoint =
          session.user.role === "USER" ? "/api/institutions" : "/api/users";
        const res = await fetch(endpoint);
        const data = await res.json();
        setChatPartners(data.data);
      } catch (error) {
        console.error("Failed to fetch chat partners", error);
      }
    };

    fetchChatPartners();
  }, [session]);

  if (status === "loading") return <p className="text-center text-gray-500">Loading...</p>;
  if (!session) return <p className="text-center text-red-500">You must be logged in to access chat.</p>;

  const sendMessage = () => {
    if (message.trim() && socket && selectedPartner) {
      const msgData = {
        senderId: session.user.id,
        receiverId: selectedPartner.id,
        message,
      };

      socket.emit("sendMessage", msgData);
      setMessages((prev) => [...prev, msgData]); // Show sent message immediately
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar - Chat Partners */}
      <div className="w-full md:w-1/4 bg-white shadow-md p-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Chat with {session.user.role === "USER" ? "Institutions" : "Users"}
        </h2>
        <div className="space-y-2">
          {chatPartners?.length > 0 ? (
            chatPartners.map((partner) => (
              <button
                key={partner.id}
                onClick={() => {setSelectedPartner(partner)}}
                className={`w-full text-left px-4 text-black py-2 rounded-md transition ${
                  selectedPartner?.id === partner.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {partner.firstName ||partner.name || "Unknown"}
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
            <div className="bg-white p-3 rounded-md shadow-md mb-2">
              <h3 className="text-lg font-semibold text-gray-700">
                Chat with {selectedPartner.name || selectedPartner.firstName ||  "Unknown"}
              </h3>
            </div>

            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto p-4 bg-white rounded-md shadow-md">
              {messages && messages
                ?.filter(
                  (msg) =>
                    // (msg.receiverId === selectedPartner.id &&
                    //   msg.senderId === session.user.id) ||
                    // (msg.receiverId === session.user.id &&
                      msg.senderId === selectedPartner.id
                    // )
                )
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`p-2 my-2 w-fit max-w-[70%] rounded-md ${
                      msg.senderId === session.user.id
                        ? "ml-auto bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    <strong>
                      {msg.senderId === session.user.id ? "You" : selectedPartner.firstName}:
                    </strong>{" "}
                    {msg.message}
                  </div>
                ))}
            </div>

            {/* Message Input */}
            <div className="flex items-center bg-white p-2 rounded-md shadow-md mt-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
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

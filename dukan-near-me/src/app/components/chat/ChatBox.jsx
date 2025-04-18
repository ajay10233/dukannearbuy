"use client";

import Image from "next/image";
import React from "react";
import { MoveLeft, Search, Heart, Plus, LockKeyhole, SmilePlus, MapPin, SendHorizontal,} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EmojiPicker from "emoji-picker-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import PaymentHistory from "./PaymentHistory";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]); // left side coversation
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null); //selected partner
  const [searchQuery, setSearchQuery] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const SendLiveLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          setMessage(googleMapsUrl);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch location. Please enable GPS.");
          return null;
        }
      );
    } else {
      alert("Geolocation is not supported in this browser.");
      return null;
    }
  };

  useEffect(() => {
    if (!session || socketRef.current) return;

    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      console.log(`✅ Connected with socket ID: ${socketRef.current.id}`);
      socketRef.current.emit("register", session.user.id);
    });

    socketRef.current.on("receiveMessage", (msg) => {
      if (
        msg.receiverId === session.user.id &&
        msg.conversationId === selectedPartner?.conversationId
      ) {
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
    const fetchMessages = async () => {
      if (!selectedPartner?.conversationId) return;

      try {
        const res = await fetch(
          `/api/messages/conversation?conversationId=${selectedPartner.conversationId}`
        );
        const data = await res.json();
        setMessages(data.data?.messages || []);
      } catch (error) {
        console.error("❌ Failed to fetch messages:", error);
      }
    };

    fetchMessages();
    // checkIfFavorite();
  }, [selectedPartner]);

//   const checkIfFavorite = async () => {
//     if (!selectedPartner) return;
//     try {
//       const res = await fetch(`/api/favorites`);
//       const data = await res.json();
//       console.log(data);
//       setIsFavorite(data.favorites.some((fav) => fav.institutionId === selectedPartner.conversationId));
//     } catch (error) {
//       console.error("❌ Failed to check favorite status:", error);
//     }
//   };

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
      console.log(data);
      setFilteredConversations(data.data);
    } catch (error) {
      console.error("❌ Search failed:", error);
    }
  };

  if (status === "loading")
    return <p className="text-center text-gray-500">Loading...</p>;
  if (!session)
    return (
      <p className="text-center text-red-500">
        You must be logged in to access chat.
      </p>
    );

  const sendMessage = async () => {
    if (!message.trim() || !socketRef.current || !selectedPartner) return;

    const timestamp = new Date().toISOString();

    let msgData;
    console.log("Selected partner currently is: ", selectedPartner);

    if (selectedPartner.otherUser) {
      msgData = {
        senderId: session.user.id,
        senderType: session.user.role,
        receiverId: selectedPartner?.otherUser.id,
        content: message,
        timestamp,
      };
    } else {
      // add conversation to the local conversations state as well
      //
      // setConversations((prevConversations) => [...prevConversations, {
      const newConversation = {
        otherUser: {
          id: selectedPartner?.id,
          name: selectedPartner?.role === "INSTITUTION" || selectedPartner?.role === "SHOP_OWNER"
            ? selectedPartner?.firmName 
            : `${selectedPartner?.firstName || ""} ${selectedPartner?.lastName || ""}`.trim(),
          profilePhoto: selectedPartner?.profilePhoto || null,
          firmName: selectedPartner?.firmName || null,
          role: selectedPartner?.role,
        },
        lastMessage: message,
        updatedAt: new Date().toISOString(),
      };

      setConversations((prevConversations) =>
        Array.isArray(prevConversations)
          ? [...prevConversations, newConversation]
          : [newConversation]
      );

      msgData = {
        senderId: session.user.id,
        senderType: session.user.role,
        receiverId: selectedPartner.id,
        content: message,
        timestamp,
      };
    }

    console.log("msg data: ", msgData);

    await socketRef.current.emit("sendMessage", msgData);

    setMessages((prev) =>
      Array.isArray(prev) ? [...prev, msgData] : [msgData]
    );
    setMessage("");
    setShowEmojiPicker(false);
  };

  // const handleLike = (user)=>{

  // }
  const handleLike = async () => {
    if (!selectedPartner) return;
    const otherUserId = selectedPartner.conversationId;
    console.log("Selected partner:", selectedPartner);

    try {
      if (isFavorite) {
        await fetch(`/api/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ institutionId: otherUserId }),
        });
      } else {
        await fetch(`/api/favorites`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ institutionId: otherUserId }),
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("❌ Failed to toggle favorite:", error);
    }
  };

  return (
    <div className="flex flex-row h-screen bg-white font-[var(--font-plus-jakarta)]">
      {/* sidebar chat  */}
      <aside className="w-1/4 bg-[#F5FAFC] p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <button
            className="p-2 cursor-pointer"
            onClick={() => setFilteredConversations([])}
          >
            <MoveLeft size={20} strokeWidth={1.5} />
          </button>

          {/* search bar  */}
          <div className="flex-1 flex items-center gap-2 bg-white px-4 py-3 rounded-3xl border border-[var(--withdarktext)]">
            <Search size={20} strokeWidth={1.5} color="#9393C1" />
            <input
              type="text"
              placeholder="Search or start a new chat"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-transparent outline-none text-sm flex-1 cursor-pointer"
            />
          </div>
        </div>

        {/* toggle tab */}
        <div className="flex items-center justify-center w-full">
          <button
            className={`w-1/2 flex items-center justify-center py-3 px-4 gap-2.5 rounded-tl-xl rounded-bl-xl transition-all duration-500 cursor-pointer ${
              !isFavorite
                ? "bg-[var(--chart-2)] text-white font-semibold"
                : "bg-white text-[var(--withdarktext)] font-normal"
            }`}
            onClick={() => setIsFavorite(false)}
          >
            Select a seller
          </button>
          <button
            className={`w-1/2 flex items-center justify-center py-3 px-4 gap-2.5 rounded-tr-xl rounded-br-xl transition-all duration-500 cursor-pointer ${
              isFavorite
                ? "bg-[var(--chart-2)] text-white font-semibold"
                : "bg-white text-[var(--withdarktext)] font-normal"
            }`}
            onClick={() => setIsFavorite(true)}
          >
            Favourite
          </button>
        </div>

        {/* Conversations List */}
        <div className="w-full">
          {isFavorite.length > 0 ? (
            isFavorite.map((partner, index) => (
              <div
                key={partner.id || `partner-${index}`}
                className="flex justify-between gap-2.5 py-2 border-b border-gray-200"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative w-14 h-14">
                    <Image
                      src="/chatUserSvg/userImage.svg"
                      alt="seller image"
                      fill
                      className="rounded-md object-cover"
                      priority
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1 flex-grow">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPartner({ ...partner });
                      }}
                      className={`font-medium text-[var(--secondary-foreground)] 
                                                ${
                                                  selectedPartner?.id ===
                                                    partner.id && "font-medium"
                                                }`}
                    >
                      {partner.firmName || partner.firstName || "Unknown"}
                    </Link>
                    <span className="text-gray-500 font-normal text-[12px]">
                      {/* Last message here... */}
                      {partner.lastMessageContent
                        ? partner.lastMessageContent
                        : "No messages yet"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center gap-1">
                  <span className="text-[var(--chat-color)] text-sm">
                    {/* Display the time */}
                    {partner.lastMessageTimestamp
                      ? new Date(
                          partner.lastMessageTimestamp
                        ).toLocaleTimeString()
                      : " "}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* <div className="w-5 h-5 flex items-center justify-center bg-[var(--chat-color)] text-white text-xs rounded-full"> */}
                    {/* no. of unread messages */}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            ))(<p className="text-center text-gray-500">No favorites yet</p>)
          ) : filteredConversations?.length > 0 ? (
            filteredConversations.map((partner, index) => (
              <div
                key={partner.id || `partner-${index}`}
                className="flex justify-between gap-2.5 py-2 border-b border-gray-200"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative w-14 h-14">
                    <Image
                      src="/chatUserSvg/userImage.svg"
                      alt="seller image"
                      fill
                      className="rounded-md object-cover"
                      priority
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-1 flex-grow">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedPartner({ ...partner });
                      }}
                      className={`font-medium text-[var(--secondary-foreground)] 
                                                ${selectedPartner?.id === partner.id && "font-medium"}`} >
                      {partner?.otherUser?.firmName || partner?.firmName || partner?.firstName || partner?.otherUser?.lastName || "Unknown"}
                    </Link>
                    <span className="text-gray-500 font-normal text-[12px]">
                      {/* Last message here... */}
                      {partner.lastMessageContent
                        ? partner.lastMessageContent
                        : "No messages yet"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center gap-1">
                  <span className="text-[var(--chat-color)] text-sm">
                    {/* Display the time */}
                    {partner.lastMessageTimestamp
                      ? new Date(
                          partner.lastMessageTimestamp
                        ).toLocaleTimeString()
                      : " "}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* <div className="w-5 h-5 flex items-center justify-center bg-[var(--chat-color)] text-white text-xs rounded-full"> */}
                    {/* no. of unread messages */}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No conversations found</p>
          )}
        </div>
      </aside>

      {/* chat box */}
      <main className="w-3/4 flex flex-col h-full bg-[#FAFAFA]">
        {selectedPartner ? (
          <>
            {/* chat header */}
            <header className="flex items-center justify-between p-4 gap-2.5 bg-[#F7F7FC]">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="chatUserSvg/userImage.svg"
                    alt="seller image"
                    fill
                    className="rounded-lg"
                    priority
                  />
                </div>
                <div className="gap-1">
                  <p className="text-[var(--chatText-color)] text-lg flex items-center gap-2">
                    {selectedPartner.firmName ||
                      selectedPartner.firstName ||
                      "Unknown"}
                    <Heart
                      size={20}
                      color="#DA3036"
                      fill={isFavorite ? "#DA3036" : "none"}
                      strokeWidth={1.5}
                      className="cursor-pointer"
                      onClick={() => handleLike(selectedPartner)}
                    />
                  </p>
                  {/* <p className="text-sm text-green-500">Online</p> */}
                </div>
              </div>
              {/* view payment history */}
              <div className="flex items-center gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-[var(--chart-2)] text-white gap-2.5 rounded-xl p-3 font-medium text-sm flex items-center cursor-pointer hover:bg-[#128c7e] transition">
                      <Plus size={18} strokeWidth={1.5} color="#fff" />
                      Payment History
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] h-4/5 rounded-xl border-none flex flex-col bg-[#F5FAFC] overflow-auto dialogScroll">
                    <DialogHeader>
                      <div className="hidden">
                        <DialogTitle></DialogTitle>
                        <DialogDescription></DialogDescription>
                      </div>
                      <div className="flex justify-center items-center font-[family-name:var(--font-plusJakarta)]">
                        <button className="bg-teal-700 p-3 w-3/4 outline-none rounded-xl text-white text-sm">
                          Your all time transaction history
                        </button>
                      </div>
                    </DialogHeader>
                    <div className="flex flex-col">
                      <PaymentHistory />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </header>

            {/* Message container */}
            <div className="flex-1 pt-1.5 pb-4 px-4 overflow-y-auto flex flex-col gap-3">
            {/* {selectedPartner && selectedPartner.accepted === false && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    You haven’t accepted this chat request yet.
                  </p>
                  <p className="text-sm">Do you want to start chatting with this person?</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                    onClick={async () => {
                      const res = await fetch(`/api/conversations/${selectedPartner.conversationId}/accept`, {
                        method: "PATCH",
                      });
                      if (res.ok) {
                        setSelectedPartner((prev) => ({ ...prev, accepted: true }));
                      }
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    onClick={async () => {
                      const res = await fetch(`/api/conversations/${selectedPartner.conversationId}/reject`, {
                        method: "PATCH",
                      });
                      if (res.ok) {
                        setSelectedPartner(null); // or trigger re-fetch
                      }
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )} */}
              {/* Encryption message */}

              <div className="flex justify-center">
                <span className="bg-[var(--secondary-color)] text-[var(--withdarkinnertext)] text-sm py-2.5 px-3.5 flex items-center gap-2 rounded-xl">
                  <LockKeyhole size={20} strokeWidth={1.5} />
                  Chats will be automatically deleted after 48 hours of last chat
                </span>
              </div>

              {messages.length > 0 ? (
                messages.map((msg, index) => {
                  // Format the message date
                  const messageDate = new Date(
                    msg.timestamp
                  ).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  // Format today's date for comparison
                  const today = new Date().toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  // Check if this is the first message of a new day
                  const isNewDay =
                    index === 0 ||
                    new Date(
                      messages[index - 1].timestamp
                    ).toLocaleDateString() !==
                      new Date(msg.timestamp).toLocaleDateString();

                  return (
                    <div
                      key={index}
                      ref={
                        index === messages.length - 1 ? messagesEndRef : null
                      }
                    >
                      {/* Date Separator */}
                      {isNewDay && (
                        <div className="flex justify-center gap-y-2">
                          <span className="px-4 py-1 text-xs font-medium text-[var(--withdarkinnertext)] bg-gray-200 rounded-lg">
                            {messageDate === today ? "Today" : messageDate}
                          </span>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`flex ${
                          msg.senderId === session.user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-2.5 ${
                            msg.senderId === session.user.id
                              ? "bg-[#D7F8F4]"
                              : "bg-white"
                          }
                            ${
                              msg.senderId === session.user.id
                                ? "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                                : "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
                            } flex items-center justify-between gap-1.5`}
                        >
                          <p className="text-[#010101] opacity-85 font-normal text-sm flex items-center gap-2">
                            {msg.content.startsWith(
                              "https://www.google.com/maps"
                            ) ? (
                              <a
                                href={msg.content}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition duration-300">
                                                                    {/* className="w-5 h-5 text-red-500 animate-bounce" */}

                                  <div className="relative w-8 h-8">
                                    <Image
                                      src="/nearbuydukan-Logo/Logo.svg"
                                      alt="nearbuydukan"
                                      fill
                                      sizes="35px"
                                      priority
                                    />
                                  </div>
                                  <span className="underline text-red-500">
                                    Live Location
                                </span>
                              </a>
                            ) : (
                              msg.content
                            )}
                          </p>

                          {msg.timestamp && (
                            <span className="text-xs text-[#0B3048] opacity-70 block text-right">
                              {new Intl.DateTimeFormat("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }).format(new Date(msg.timestamp))}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="p-4 text-center text-gray-500">
                  No messages yet.
                </p>
              )}

              {showEmojiPicker && (
                <div className="absolute bottom-14 left-1/4 z-10">
                  <EmojiPicker
                    onEmojiClick={(e) => setMessage(message + e.emoji)}
                  ></EmojiPicker>
                </div>
              )}
            </div>

            {/* Accept/Reject Chat UI */}
            {selectedPartner && selectedPartner.accepted === false && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg m-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    You haven’t accepted this chat request yet.
                  </p>
                  <p className="text-sm">Do you want to start chatting with this person?</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 cursor-pointer text-white py-1 px-3 rounded"
                    onClick={async () => {
                      const res = await fetch(`/api/conversations/${selectedPartner.conversationId}/accept`, {
                        method: "PATCH",
                      });
                      if (res.ok) {
                        setSelectedPartner((prev) => ({ ...prev, accepted: true }));
                      }
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 cursor-pointer text-white py-1 px-3 rounded"
                    onClick={async () => {
                      const res = await fetch(`/api/conversations/${selectedPartner.conversationId}/reject`, {
                        method: "PATCH",
                      });
                      if (res.ok) {
                        setSelectedPartner(null); // optional: or trigger re-fetch
                      }
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}    

            {selectedPartner && selectedPartner.accepted && (
              <>
                {/* chat footer  */}
                <footer className="p-4 flex items-center bg-[#F6F6F6] gap-3">
                  <div className="gap-4">
                    <button
                      className="p-2 cursor-pointer"
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                      }}
                    >
                      <SmilePlus size={20} strokeWidth={1.5} color="#130F26" />
                    </button>
                    <button className="p-2 cursor-pointer relative">
                      <MapPin
                        size={20}
                        strokeWidth={1.5}
                        color="#130F26"
                        onClick={() => SendLiveLocation()}
                      />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-4 rounded-full bg-white focus:outline-none shadow-sm"
                  />
                  <button className="p-2 cursor-pointer" onClick={sendMessage}>
                    <SendHorizontal size={20} strokeWidth={1.5} />
                  </button>
                </footer>
              </>
            )}    
          </>
        ) : (
          <p className="p-4 text-center text-gray-500">
            Select a conversation to start chatting.
          </p>
        )}
      </main>
    </div>
  );
}

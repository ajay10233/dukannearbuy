"use client";

import Image from "next/image";
import React from "react";
import { MoveLeft, Search, Plus, LockKeyhole, SmilePlus, MapPin, SendHorizontal, Crown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import EmojiPicker from "emoji-picker-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PaymentHistory from "./PaymentHistory";
import CryptoJS from 'crypto-js';
import { ChevronLeft } from "lucide-react";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import toast from "react-hot-toast";
import LogoLoader from "../LogoLoader";

export default function ChatBox() {
  const searchParams = useSearchParams();
  const { socket, user: loggedInUser } = useUser();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  // const [isFavorite, setIsFavorite] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMsgRequest, setIsMsgRequest] = useState(false);
  const [messageRequests, setMessageRequests] = useState([]);
  const [loading, setLoading] = useState(true);


  // const [loggedInUser, setLoggedInUser] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();


  const getDisplayName = (partner) => {
    const user = partner?.otherUser || partner;
    if (!user) return "Unknown";

    const isInstitutionOrShop = user.role === "INSTITUTION" || user.role === "SHOP_OWNER";

    if (isInstitutionOrShop) {
      return user.firmName || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown";
    }

    if (user?.firstName || user?.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }

    return user?.name || "Unknown";
  };

  const encryptMessage = (message, secretKey) => {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
  }

  function decryptMessage(encryptedMessage, secretKey) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Error decrypting message:", error);
      return '';
    }
  }

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
          toast.error("Unable to fetch location. Please enable GPS.");
          return null;
        }
      );
    } else {
      alert("Geolocation is not supported in this browser.");
      return null;
    }
  };

  useEffect(() => {
    if (!socket || !loggedInUser) return;

    const handleReceiveMessage = (msg) => {
      console.log("Received message:", msg);

      if (
        msg.receiverId === loggedInUser.id &&
        msg.conversationId === selectedPartner?.conversationId
      ) {
        const selected_id = selectedPartner?.otherUser
          ? selectedPartner.otherUser.id
          : selectedPartner.id;

        const secretKey = loggedInUser.id + selected_id;

        const decryptedMessage = decryptMessage(msg.content, secretKey);

        if (decryptedMessage) {
          console.log("✅ Decrypted message:", decryptedMessage);
          setMessages((prev) => [...prev, { ...msg, content: decryptedMessage }]);
        } else {
          console.log("❌ Decryption failed or message is empty.");
        }
      } else {
        const sender = filteredConversations.find((c) => {
          const targetId = c?.otherUser.id ?? c.id;
          return targetId == msg.senderId;
        });

        console.log("Sender:", sender);

        if (!sender) {
          toast.success("You have a new message");
        } else {
          toast.success(`You have a new message from ${getDisplayName(sender)}`);
        }
      }
    };

    // Register user on socket connect
    socket.emit("register", loggedInUser.id);
    console.log(`✅ Socket connected: ${socket.id}`);

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, loggedInUser, selectedPartner, setMessages]);


  useEffect(() => {
    if (!session) return;

    const fetchConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/conversations/all`);
        const data = await res.json();
        console.log(data);

        const updatedConversations = data?.data?.map((conversation) => {
          const lastMessage = conversation.lastMessage;
          if (lastMessage) {
            const isSentByCurrentUser = lastMessage.senderId === session.user.id;
            const secretKey =
              isSentByCurrentUser
                ? conversation.otherUser.id + session.user.id
                : session.user.id + conversation.otherUser.id;

            // Decrypt last message content
            lastMessage.content = decryptMessage(lastMessage.content, secretKey);
          }

          return conversation;
        });

        console.log("Updated conversations: ", updatedConversations);

        setConversations(updatedConversations);
        setFilteredConversations(updatedConversations);

        checkForParams(updatedConversations);

      } catch (error) {
        console.error("❌ Failed to fetch conversations:", error);
      } finally {
      setLoading(false); 
    }

    };


    fetchConversations();
    // checkForParams();
  }, [session]);

  useEffect(() => {
    if (!selectedPartner) return;

    const fetchMessages = async () => {
      setMessage([]);
      console.log("Selected partner currently is: ", selectedPartner);
      if (!selectedPartner?.conversationId) {
        try {
          const res = await fetch(
            `/api/messages/conversation?userId=${selectedPartner.id}`
          );
          const data = await res.json();
          let messages = data.data?.messages || [];

          if (messages.length > 0) {
            const selected_id = selectedPartner?.otherUser ? selectedPartner?.otherUser.id : selectedPartner.id;

            const decryptedMessages = messages.map((msg) => {
              const isSentByCurrentUser = msg.senderId === session.user.id;
              const secretKey = isSentByCurrentUser
                ? selected_id + session.user.id
                : session.user.id + selected_id;

              return {
                ...msg,
                content: decryptMessage(msg.content, secretKey),
              };
            });

            setMessages(decryptedMessages);
          } else {
            setMessages([]);
          }

        } catch (error) {
          console.error("❌ Failed to fetch messages:", error);
        }
      }

      else {
        try {
          const res = await fetch(
            `/api/messages/conversation?conversationId=${selectedPartner.conversationId}`
          );
          const data = await res.json();
          let messages = data.data?.messages || [];

          if (messages.length > 0) {
            const selected_id = selectedPartner?.otherUser ? selectedPartner?.otherUser.id : selectedPartner.id;

            const decryptedMessages = messages.map((msg) => {
              const isSentByCurrentUser = msg.senderId === session.user.id;
              const secretKey = isSentByCurrentUser
                ? selected_id + session.user.id
                : session.user.id + selected_id;;

              return {
                ...msg,
                content: decryptMessage(msg.content, secretKey),
              };
            });

            setMessages(decryptedMessages);
          } else {
            setMessages([]);
          }

        } catch (error) {
          console.error("❌ Failed to fetch messages:", error);
        }
      }
    };

    fetchMessages();
  }, [selectedPartner]);

  const checkForParams = async (allConversations = conversations) => {
    const toParam = searchParams.get("to");
    if (toParam == null || toParam === session.user.id) return;

    if (toParam) {
      const conversation = allConversations.find(
        (conv) => conv.otherUser.id === toParam
      );
      if (conversation) {
        setSelectedPartner(conversation);
      } else {
        const result = await axios.get(`/api/users/${toParam}/`);
        const newUser = result.data;
        const newConversation = {
          conversationId: null,
          otherUser: newUser,
          lastMessage: {},
          updatedAt: new Date(),
          accepted: true,
        };
        setSelectedPartner(newConversation);
        const res = filteredConversations.find(
          (conv) => conv?.otherUser?.id == newConversation.otherUser.id
        );
        console.log("res isL ", res);
        if (!res) {
          console.log("Called !res")
          setFilteredConversations(prev => [...prev, newConversation]);
          setConversations(prev => [...prev, newConversation]);
        }
      }
    }
  }

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const DEBOUNCE_DELAY = 300; // ms

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!searchQuery || searchQuery.trim() == "") {
        if (conversations.length > 0) {
          setFilteredConversations(conversations);
        }
        return;
      }
      try {
        const res = await fetch(`/api/users/search?query=${searchQuery}`);
        const data = await res.json();
        const combinedResults = [
          ...(Array.isArray(data.data) ? data.data : []),
          ...(Array.isArray(data.users) ? data.users : [])
        ];

        if (combinedResults.length > 0) {
          console.log("Combined results: ");
          setFilteredConversations(combinedResults);
        } else {
          console.log("Combined else ");
          setFilteredConversations(conversations);
        }

        console.log("Combined results out ");
        setFilteredConversations(combinedResults);
      } catch (error) {
        console.error("❌ Search failed:", error);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const fetchMessageRequests = async () => {
      try {
        const res = await fetch("/api/conversations/unread");
        const data = await res.json();
        console.log("Message requests response:", data);

        if (res.ok) {
          const decryptedRequests = data?.data?.map((conversation) => {
            const lastMessage = conversation.lastMessage;
            if (lastMessage) {
              const isSentByCurrentUser = lastMessage.senderId === session.user.id;
              const secretKey = isSentByCurrentUser
                ? conversation.otherUser.id + session.user.id
                : session.user.id + conversation.otherUser.id;

              // Decrypt last message content
              lastMessage.content = decryptMessage(lastMessage.content, secretKey);
            }

            return conversation;
          });

          setMessageRequests(decryptedRequests || []);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching message requests", err);
      }
    };

    fetchMessageRequests();
  }, []);


  if (loading) {
    return <LogoLoader content={"Loading conversations..."} />;
  }

  if (status === "loading")
    return <p className="text-center text-gray-500">Loading...</p>;

  if (!session)
    return (
      <p className="text-center text-red-500">
        You must be logged in to access chat.
      </p>
    );

  const sendMessage = async () => {
    if (!message.trim() || !socket || !selectedPartner) return;

    const timestamp = new Date().toISOString();
    const selected_id = selectedPartner?.otherUser ? selectedPartner.otherUser.id : selectedPartner.id;
    const secretKey = selected_id + session.user.id;
    const encryptedMessage = encryptMessage(message, secretKey);

    const decryptedMessage = message;

    // Create the lastMessage object
    const lastMessage = {
      senderId: session.user.id,
      senderType: session.user.role,
      receiverId: selectedPartner?.otherUser ? selectedPartner.otherUser.id : selectedPartner.id,
      content: decryptedMessage,
      timestamp,
      conversationId: selectedPartner?.conversationId || null,
      expiresAt: null,
    };

    let msgData = {
      senderId: session.user.id,
      senderType: session.user.role,
      receiverId: selectedPartner?.otherUser ? selectedPartner.otherUser.id : selectedPartner.id,
      content: encryptedMessage,
      timestamp,
      accepted: selectedPartner?.role == "USER" ? false : selectedPartner.accepted,
    };

    // Helper function to update conversations array
    function updateConversationsArray(prevConversations) {
      if (!Array.isArray(prevConversations)) {
        console.log("New converasation being created");
        return [createNewConversation()];
      }
      const selectedUserId = selectedPartner?.otherUser ? selectedPartner.otherUser.id : selectedPartner.id;
      console.log("selectedUserId:asdfasdfasfasddfasd ", selectedPartner);
      const updatedConversation = {
        otherUser: {
          id: selectedPartner?.otherUser ? selectedPartner?.otherUser.id : selectedPartner.id,
          // name: getDisplayName(selectedPartner),
          firstName: selectedPartner?.otherUser ? selectedPartner?.otherUser.firstName || null : selectedPartner?.firstName,
          lastName: selectedPartner?.otherUser ? selectedPartner?.otherUser.lastName || null : selectedPartner?.lastName,
          profilePhoto: selectedPartner?.otherUser ? selectedPartner?.otherUser.profilePhoto || selectedPartner?.profilePhoto : "",
          firmName: getDisplayName(selectedPartner),
          role: selectedPartner?.otherUser ? selectedPartner?.otherUser.role : selectedPartner.role,
        },
        lastMessage,
        updatedAt: timestamp,
        accepted: selectedPartner?.role == "USER" ? false : selectedPartner.accepted,
      };
      console.log("updatedConversation: ", updatedConversation);

      // Filter out the existing conversation (if any)
      const filtered = prevConversations.filter((conv) => {
        const userId = conv.otherUser?.id || conv.id;
        return userId !== selectedUserId;
      });

      // Place updated conversation at the top
      return [updatedConversation, ...filtered];
    }

    function createNewConversation() {
      return {
        otherUser: {
          id: selectedPartner.id,
          name:
            selectedPartner.role === "INSTITUTION" || selectedPartner.role === "SHOP_OWNER"
              ? selectedPartner.firmName
              : `${selectedPartner.firstName || ""} ${selectedPartner.lastName || ""}`.trim(),
          profilePhoto: selectedPartner.profilePhoto || null,
          firmName: selectedPartner.firmName || null,
          role: selectedPartner.role,
        },
        lastMessage,
        updatedAt: timestamp,
        accepted: selectedPartner?.role == "USER" ? false : selectedPartner.accepted,
      };
    }

    setConversations(updateConversationsArray);
    setFilteredConversations(updateConversationsArray);

    // return;

    await socket.emit("sendMessage", msgData);

    setMessages((prev) =>
      Array.isArray(prev) ? [...prev, { ...msgData, content: decryptedMessage }] : [{ ...msgData, content: decryptedMessage }]
    );

    setMessage("");
    setShowEmojiPicker(false);
  };

  // Function to fetch the session data
  const fetchSessionAndRedirect = async () => {

    try {
      // const res = await fetch("/api/users/me");
      // const data = await res.json();
      const data = loggedInUser;

      if (data?.role == "USER") {
        router.push("/UserHomePage");
      } else if (data?.role == "INSTITUTION" || data?.role == "SHOP_OWNER") {
        router.push("/partnerHome");
      } else {
        console.error("Unknown role or not logged in.");
      }
    } catch (err) {
      console.error("Error fetching session", err);
    }
  };

  const getTruncatedMessage = (message) => {
    const maxLength = 20;

    if (message.length > maxLength) {
      return message.substring(0, maxLength) + " ...";
    }

    return message;
  };

  return (
    <div className="flex min-h-screen bg-white font-[var(--font-plus-jakarta)]">
      {/* Left Sidebar */}
      <div
        className={`${selectedPartner ? "hidden md:flex" : "flex"
          } flex-col gap-2 sm:gap-4 w-full md:w-[30%] bg-[#F5FAFC] p-4`}
      >
        <div className="flex items-center gap-2">
          <button
            className="p-2 cursor-pointer"
            onClick={fetchSessionAndRedirect}
          >
            <MoveLeft size={20} strokeWidth={1.5} />
          </button>

          {/* Search bar */}
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

        {/* Toggle Tab */}
        <div className="flex items-stretch justify-center w-full">
          <button
            className={`w-1/2 flex items-center justify-center text-center py-3 px-4 gap-2.5 rounded-tl-xl rounded-bl-xl transition-all duration-500 cursor-pointer ${!isMsgRequest
              ? "bg-[var(--chart-2)] text-white font-semibold"
              : "bg-white text-[var(--withdarktext)] font-normal"
              }`}
            onClick={() => setIsMsgRequest(false)}
          >
            Select a seller
          </button>
          <button
            className={`w-1/2 flex items-center justify-center text-center py-3 px-4 gap-2.5 rounded-tr-xl rounded-br-xl transition-all duration-500 cursor-pointer ${isMsgRequest
              ? "bg-[var(--chart-2)] text-white font-semibold"
              : "bg-white text-[var(--withdarktext)] font-normal"
              }`}
            onClick={() => setIsMsgRequest(true)}
          >
            Message requests
          </button>
        </div>

        {/* Conversations List */}
        <div className="mt-4 h-[calc(100vh-200px)]  overflow-y-auto dialogScroll">
          {isMsgRequest ? (

            messageRequests.length > 0 ? (
              messageRequests.map((partner, index) => (
                <div
                  onClick={() => {
                    setSelectedPartner({ ...partner });
                  }}
                  key={partner.conversationId || `msg-${index}`}
                  className="flex cursor-pointer justify-between gap-2.5 py-2 border-b border-gray-200 mr-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-14 h-14">
                      <Image
                        src={
                          partner?.otherUser
                            ? partner?.otherUser?.profilePhoto && partner?.otherUser?.profilePhoto !== "null"
                              ? partner?.otherUser?.profilePhoto
                              : "/default-img.png"
                            : partner?.profilePhoto && partner?.profilePhoto !== "null"
                              ? partner?.profilePhoto
                              : "/default-img.png"
                        }
                        alt="profile image"
                        fill
                        sizes="(max-width: 768px) 40px, (max-width: 1200px) 50px, 60px"
                        className="rounded-md object-cover"
                        priority
                      />

                    </div>
                    <div className="flex flex-col justify-center gap-1 flex-grow">
                      <div className={`font-medium text-[var(--secondary-foreground)] capitalize ${selectedPartner?.id === partner.id && "font-medium"}`}>
                        <span className="inline-flex items-center gap-1">
                          {getDisplayName(partner)}

                          {partner.otherUser?.subscriptionPlan?.name === "PREMIUM" &&  
                            partner.otherUser?.planExpiresAt &&
                            new Date(partner.otherUser?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#f0d000" className="text-yellow-500" />
                            )}

                          {partner.otherUser?.subscriptionPlan?.name === "BUSINESS" && 
                            partner.otherUser?.planExpiresAt &&
                            new Date(partner.otherUser?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#AFAFAF" className="text-gray-400" />
                            )}
                        </span>
                      </div>
                      <span className="text-gray-500 font-normal text-[12px]">
                        {/* Last message here... */}
                        {
                          partner?.lastMessage?.content
                            ? getTruncatedMessage(partner?.lastMessage?.content)
                            : "No messages yet"
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center gap-1">
                    {partner.lastMessage?.content && partner.lastMessage?.timestamp && (
                      <span className="text-gray-500 text-xs">
                        {new Date(partner.lastMessage.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No Message Request yet</p>)
          ) : (
            filteredConversations?.length > 0 ? (
              filteredConversations.map((partner, index) => (
                <div
                  onClick={() => {
                    setSelectedPartner({ ...partner });
                  }}
                  key={partner.id || `partner-${index}`}
                  className="flex cursor-pointer justify-between gap-2.5 py-2 border-b border-gray-200 mr-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-14 h-14">
                      <Image
                        src={
                          partner?.otherUser
                            ? partner?.otherUser?.profilePhoto && partner?.otherUser?.profilePhoto !== "null"
                              ? partner?.otherUser?.profilePhoto
                              : "/default-img.png"
                            : partner?.profilePhoto && partner?.profilePhoto !== "null"
                              ? partner?.profilePhoto
                              : "/default-img.png"
                        }
                        alt="seller image"
                        fill
                        sizes="(max-width: 768px) 40px, (max-width: 1200px) 50px, 60px"
                        className="rounded-md object-cover"
                        priority
                      />

                    </div>
                    <div className="flex flex-col justify-center gap-1 flex-grow">
                      <div
                        className={`font-medium text-[var(--secondary-foreground)] capitalize ${selectedPartner?.id === partner.id && "font-medium"}`}>
                        <span className="inline-flex items-center gap-1">
                          {getDisplayName(partner)}

                           {partner?.subscriptionPlan?.name === "PREMIUM" && 
                            partner?.planExpiresAt &&
                            new Date(partner?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#f0d000" className="text-yellow-500" />
                            )}

                          {partner?.subscriptionPlan?.name === "BUSINESS" && 
                            partner?.planExpiresAt &&
                            new Date(partner?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#AFAFAF" className="text-gray-400" />
                            )}

                          {partner.otherUser?.subscriptionPlan?.name === "PREMIUM" && 
                            partner.otherUser?.planExpiresAt &&
                            new Date(partner.otherUser?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#f0d000" className="text-yellow-500" />
                            )}

                          {partner.otherUser?.subscriptionPlan?.name === "BUSINESS" && 
                            partner.otherUser?.planExpiresAt &&
                            new Date(partner.otherUser?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#AFAFAF" className="text-gray-400" />
                            )}
                        </span>
                      </div>
                      <span className="text-gray-500 font-normal text-[12px]">
                        {
                          partner?.lastMessage?.content
                            ? getTruncatedMessage(partner?.lastMessage?.content)
                            : "No messages yet"
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-center gap-1">
                    {partner.lastMessage?.content && partner.lastMessage?.timestamp && (
                      <span className="text-gray-500 text-xs">
                        {new Date(partner.lastMessage.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No conversations found</p>
            )
          )}
        </div>
      </div>

      {/* Right Chat Box */}
      <div className={`${selectedPartner ? "flex" : "hidden md:flex"} flex-col w-full md:w-[70%] bg-[#FAFAFA]`} >
        {selectedPartner ? (
          <>
            {/* Chat Header */}
            <header className="flex items-center justify-between gap-1 md:gap-0 p-2 md:p-4 bg-[#F7F7FC]">
              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="md:hidden flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-200 transition-all cursor-pointer ease-in-out duration-400"
                >
                  <ChevronLeft size={24} strokeWidth={2} />
                </button>
                <div className="relative w-10 h-10">
                  <Image
                    src={selectedPartner?.otherUser ?
                      selectedPartner?.otherUser?.profilePhoto && selectedPartner?.otherUser?.profilePhoto != "null" ? selectedPartner?.otherUser?.profilePhoto : "/default-img.png"
                      : selectedPartner?.profilePhoto && selectedPartner?.profilePhoto != "null" ? selectedPartner?.profilePhoto : "/default-img.png"
                    }
                    alt="seller image"
                    fill
                    className="rounded-lg"
                    priority
                  />
                </div>
                <div>
                  <p className="text-[var(--chatText-color)] text-[16px] md:text-lg flex items-center gap-0 md:gap-2 capitalize">
                    {selectedPartner
                      &&
                      (
                        <Link href=
                          {
                            selectedPartner?.otherUser
                              ?
                              selectedPartner?.otherUser?.role === "INSTITUTION" ||
                                selectedPartner?.otherUser?.role === "SHOP_OWNER"
                                ? `/partnerProfile/${selectedPartner.otherUser.id}`
                                : `/userProfile/${selectedPartner.otherUser.id}`

                              :
                              selectedPartner?.role === "INSTITUTION" ||
                                selectedPartner?.role === "SHOP_OWNER"
                                ? `/partnerProfile/${selectedPartner.id}`
                                : `/userProfile/${selectedPartner.id}`
                          }
                          className="inline-flex items-center gap-1">
                        {getDisplayName(selectedPartner)}
                        
                          {selectedPartner?.subscriptionPlan?.name === "PREMIUM" &&
                            selectedPartner?.planExpiresAt &&
                            new Date(selectedPartner?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#f0d000" className="text-yellow-500" />
                            )}

                          {selectedPartner?.subscriptionPlan?.name === "BUSINESS" &&
                            selectedPartner?.planExpiresAt &&
                            new Date(selectedPartner?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#AFAFAF" className="text-gray-400" />
                            )}

                          {selectedPartner.otherUser?.subscriptionPlan?.name === "PREMIUM" &&
                            selectedPartner.otherUser?.planExpiresAt &&
                            new Date(selectedPartner.otherUser?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#f0d000" className="text-yellow-500" />
                            )}

                          {selectedPartner.otherUser?.subscriptionPlan?.name === "BUSINESS" &&
                            selectedPartner.otherUser?.planExpiresAt &&
                            new Date(selectedPartner.otherUser?.planExpiresAt) > new Date() && (
                              <Crown size={16} fill="#AFAFAF" className="text-gray-400" />
                            )}

                        </Link>
                      )}
                  </p>
                </div>
              </div>
              {/* view payment history */}
              <div className="flex items-center gap-1 md:gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="bg-[var(--chart-2)] text-white gap-1 md:gap-2.5 rounded-xl p-2 md:p-3 font-medium text-xs md:text-sm flex items-center cursor-pointer hover:bg-[#128c7e] transition">
                      <Plus size={18} strokeWidth={1.5} color="#fff" />
                      Payment History
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] h-4/5 rounded-xl border-none flex flex-col gap-2 md:gap-4 bg-[#F5FAFC] overflow-auto dialogScroll">
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
                      <PaymentHistory receiverId={selectedPartner?.otherUser ? selectedPartner.otherUser.id : selectedPartner.id} />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </header>

            {/* Message Area */}
            <div className="flex-1 pt-2 pb-4 px-4 overflow-y-auto flex flex-col gap-3 h-[calc(100vh-40px)]">
              <div className="flex justify-center">

                {(() => {
                  const partner = selectedPartner?.otherUser || selectedPartner;

                  const isPremium =
                    partner?.subscriptionPlan?.name === "PREMIUM" &&
                    new Date(partner?.planExpiresAt) > new Date();

                  return isPremium ? (
                    <span className="bg-[var(--secondary-color)] text-[var(--withdarkinnertext)] sm:text-sm text-[8px] py-2.5 px-3.5 flex items-center gap-2 rounded-xl">
                      <LockKeyhole size={20} strokeWidth={1.5} />
                      Messages are end-to-end encrypted.
                    </span>
                  ) : (
                    <span className="bg-[var(--secondary-color)] text-[var(--withdarkinnertext)] sm:text-sm text-[8px] py-2.5 px-3.5 flex items-center gap-2 rounded-xl">
                      <LockKeyhole size={20} strokeWidth={1.5} />
                      Chats will be automatically deleted after 48 hours of last activity.
                    </span>
                  );
                })()}

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
                        <div className="flex justify-center gap-y-2 mb-2">
                          <span className="px-4 py-1 text-xs font-medium text-[var(--withdarkinnertext)] bg-gray-200 rounded-lg">
                            {messageDate === today ? "Today" : messageDate}
                          </span>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`flex ${msg.senderId === session.user.id
                          ? "justify-end"
                          : "justify-start"
                          }`}
                      >
                        <div
                          className={`p-2.5 ${msg.senderId === session.user.id
                            ? "bg-[#D7F8F4]"
                            : "bg-white"
                            }
                            ${msg.senderId === session.user.id
                              ? "rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                              : "rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
                            } max-w-[75%] break-words`}
                        >
                          <div className="flex justify-between items-end gap-2">

                            <div className="text-[#010101] opacity-85 font-normal text-sm">
                              {msg.content.startsWith(
                                "https://www.google.com/maps"
                              ) ? (
                                <a
                                  href={msg.content}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition duration-300"
                                >

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
                            </div>

                            {msg.timestamp && (
                              <span className="text-xs text-[#0B3048] opacity-70 block text-right whitespace-nowrap">
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
                    </div>
                  );
                })
              ) : (
                <p className="p-4 text-center text-gray-500">
                  No messages yet.
                </p>
              )}

              {showEmojiPicker && (
                <div className="absolute bottom-14 left-0 md:left-1/4 z-10">
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
                    You haven't accepted this chat request yet.
                  </p>
                  <p className="text-sm">
                    Do you want to start chatting with this person?
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 cursor-pointer text-white py-1 px-3 rounded"
                    onClick={async () => {
                      const res = await fetch(
                        `/api/conversations/${selectedPartner.conversationId}/accept`,
                        {
                          method: "PATCH",
                        }
                      );
                      if (res.ok) {
                        setSelectedPartner((prev) => ({
                          ...prev,
                          accepted: true,
                        }));
                      }
                    }}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 cursor-pointer text-white py-1 px-3 rounded"
                    onClick={async () => {
                      const res = await fetch(
                        `/api/conversations/${selectedPartner.conversationId}/reject`,
                        {
                          method: "PATCH",
                        }
                      );
                      if (res.ok) {
                        setSelectedPartner(null);
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
                <footer className="p-4 flex items-center bg-[#F6F6F6] gap-1 md:gap-3">
                  <div className="flex gap-2 md:gap-4">
                    <button
                      className="p-0.5 md:p-2 cursor-pointer"
                      onClick={() => {
                        setShowEmojiPicker(!showEmojiPicker);
                      }}
                    >
                      <SmilePlus size={20} strokeWidth={1.5} color="#130F26" />
                    </button>
                    <button className="p-0.5 md:p-2 cursor-pointer relative">
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
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-4 rounded-full bg-white focus:outline-none shadow-sm"
                  />
                  <button className="p-0.5 md:p-2 cursor-pointer" onClick={sendMessage}>
                    <SendHorizontal size={20} strokeWidth={1.5} />
                  </button>
                </footer>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col justify-center items-center flex-1">
            {/* <p className="text-gray-500">Select a conversation to start chatting</p> */}

            <div className="relative w-17 h-17 md:w-80 md:h-80">
              <Image
                src="/nearbuydukan - watermark.png"
                alt="Watermark"
                fill sizes="120"
                className="object-contain w-17 h-17 md:w-80 md:h-80"
                priority
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

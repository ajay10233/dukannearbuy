"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle, AlertCircle, Trash, Scan, Loader, RefreshCw, CheckCheck } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import toast from "react-hot-toast";
import { TfiAnnouncement } from "react-icons/tfi";


export default function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notification"); 
        const data = await res.json();
        console.log(data);
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notification/${id}`, {
        method: "PUT",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          )
        );
        toast.success("Marked as read")
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
      toast.error("Failed to mark as read");
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notification/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("Notification deleted");
      }
    } catch (err) {
      console.error("Failed to delete", err);
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <Head>
        <title>Notifications</title>
      </Head>
      <section className="h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-200 pt-20 px-6 pb-6 md:px-12 md:pb-12 md:pt-20">
        <div className="w-[350px] h-150 md:h-160 md:w-full md:max-w-7xl bg-transparent rounded-3xl shadow-xl p-0 overflow-hidden">
          <div className="p-4 md:p-6 sticky top-0 bg-white z-10 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="h-8 w-8 text-blue-500" />
              {/* <TfiAnnouncement className="h-8 w-8 text-blue-500" /> */}
              Notifications
            </h2>
          </div>
          <div className="max-h-[500px] md:max-h-[520px] overflow-y-auto p-2 md:p-8 flex flex-col gap-2 md:gap-4 dialogScroll">
            
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">No notifications yet.</p>
            ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-2.5 md:gap-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-4 shadow-sm transition-all duration-300 ${n.isRead ? "" : "bg-yellow-50"}`}
                  >
                    <div className="flex items-center justify-center rounded-full bg-gray-100 border p-2 shadow-inner">
{/*
                      {n.message.includes("completed")  ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : n.message.includes("started processing") ? (
                        <Loader className="h-5 w-5 text-yellow-600 animate-spin [animation-duration:2000ms]" />
                      ) : n.message.includes("generated") ? (
                        <RefreshCw className="h-5 w-5 text-blue-600 animate-spin [animation-duration:2000ms]" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
*/}
                      
                        {n.type === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : n.type === "processing" ? (
                          <Loader className="h-5 w-5 text-yellow-600 animate-spin [animation-duration:2000ms]" />
                        ) : n.type === "generated" ? (
                          <RefreshCw className="h-5 w-5 text-blue-600 animate-spin [animation-duration:2000ms]" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        )}
                      
                    </div>

                    <div className="flex-1">
                      <h4 className="text-md md:text-lg font-semibold text-gray-800">{n.title}</h4>
                      <p className="text-sm text-gray-600 flex items-center justify-between">
                        <span>{n.message}</span>
                        {n.isRead && (
                          <CheckCheck size={18} className="text-emerald-600 hidden md:inline-block" />
                        )}
                      </p>

                      <span className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                        {new Date(n.createdAt).toLocaleString()}
                        
                        {n.isRead && (
                          <CheckCheck size={18} className="text-emerald-600 inline-block md:hidden" />
                        )}
                      </span>
                      <div className="flex gap-2 mt-2">
                        {!n.isRead && (
                          <button
                            className="text-blue-500 text-xs cursor-pointer hover:underline"
                            onClick={() => markAsRead(n.id)}
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          className="text-red-500 text-xs cursor-pointer hover:underline"
                          onClick={() => deleteNotification(n.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
        <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
          <Image
            src="/nearbuydukan - watermark.png"
            alt="Watermark"
            fill sizes="128px"
            className="object-contain"
            priority
          />
        </div>
      </section>
    </>
  );
}

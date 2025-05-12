"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle, AlertCircle } from "lucide-react";
import Head from "next/head";
import { Grid } from "react-loader-spinner";
import Image from "next/image";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notification");
        const data = await res.json();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`/api/notification/${userId}`, {
        method: "PUT",
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notification/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        <Grid
          height="80"
          width="80"
          color="#3b82f6"
          ariaLabel="grid-loading"
          radius="12.5"
          visible={true}
        />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Notifications</title>
      </Head>
      <section className="h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-200 pt-20 px-6 pb-6 md:px-12 md:pb-12 md:pt-20">
        <div className="w-[350px] h-150 md:h-160 md:w-full md:max-w-7xl bg-transparent rounded-3xl shadow-xl p-0 overflow-hidden">
          <div className="p-4 md:p-6 sticky top-0 bg-white z-10 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-500" />
              Notifications
            </h2>
          </div>

          <div className="max-h-[500px] md:max-h-[520px] overflow-y-auto p-2 md:p-8 flex flex-col gap-2 md:gap-4 dialogScroll">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">No notifications yet.</p>
            ) : (
<<<<<<< HEAD
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-2.5 md:gap-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-4 shadow-sm transition-all duration-300 ${n.isRead ? "" : "bg-yellow-50"}`}
                  >
                    <div className="flex items-center justify-center rounded-full bg-gray-100 border p-2 shadow-inner">
                      {n.type === "success" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : n.type === "info" ? (
                        <Bell className="h-5 w-5 text-blue-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-md md:text-lg font-semibold text-gray-800">{n.title}</h4>
                      <p className="text-sm text-gray-600">{n.message}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{new Date(n.createdAt).toLocaleString()}</span>
                      <div className="flex gap-2 mt-2">
                        {!n.isRead && (
                          <button
                            className="text-blue-500 text-xs cursor-pointer hover:underline"
                            onClick={() => markAsRead(n.id)}
                          >
                            Mark as Read
                          </button>
                        )}
=======
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-2.5 md:gap-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-4 shadow-sm transition-all duration-300 ${
                    n.isRead ? "" : "bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center justify-center rounded-full bg-gray-100 border p-2 shadow-inner">
                    {n.type === "success" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : n.type === "info" ? (
                      <Bell className="h-5 w-5 text-blue-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-md md:text-lg font-semibold text-gray-800">
                      {n.title}
                    </h4>
                    <p className="text-sm text-gray-600">{n.message}</p>
                    <span className="text-xs text-gray-400 mt-1 block">{n.time}</span>
                    <div className="flex gap-2 mt-2">
                      {!n.isRead && (
>>>>>>> psc1
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
            fill
            sizes="128px"
            className="object-contain"
            priority
          />
        </div>
      </section>
    </>
  );
}

"use client";

import { Bell, CheckCircle, AlertCircle } from "lucide-react";
import Head from "next/head";
import Image from "next/image";

export default function Notification() {
  const notifications = [
    {
      id: 1,
      title: "Payment Successful",
      message: "Your transaction has been completed successfully.",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      type: "success",
      time: "2 minutes ago",
    },
    {
      id: 2,
      title: "New Message",
      message: "You have received a new message from John.",
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      type: "info",
      time: "10 minutes ago",
    },
    {
      id: 3,
      title: "Action Required",
      message: "Your profile is incomplete. Please update it.",
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      type: "warning",
      time: "1 hour ago",
    },
    {
      id: 4,
      title: "Payment Successful",
      message: "Your transaction has been completed successfully.",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      type: "success",
      time: "2 minutes ago",
    },
    {
      id: 5,
      title: "New Message",
      message: "You have received a new message from John.",
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      type: "info",
      time: "10 minutes ago",
    },
    {
      id: 6,
      title: "Action Required",
      message: "Your profile is incomplete. Please update it.",
      icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
      type: "warning",
      time: "1 hour ago",
    },
  ];

  return (
    <>
      <Head>
        <title>Notifications</title>
      </Head>
      <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 pt-8 px-6 pb-6 md:p-12">
        <div className="w-[350px] md:w-full md:max-w-7xl bg-transparent rounded-3xl shadow-xl p-0 overflow-hidden">
          <div className="p-4 md:p-6 sticky top-0 bg-white z-10 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-500" />
              Notifications
            </h2>
          </div>
          <div className="max-h-[500px] md:max-h-[520px] overflow-y-auto p-2 md:p-8 flex flex-col gap-2 md:gap-4 dialogScroll">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-2.5 md:gap-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-4 shadow-sm transition-all duration-300"
              >
                <div className="flex items-center justify-center rounded-full bg-gradient-to-br from-white to-gray-100 border p-2 shadow-inner">
                  {n.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-md md:text-lg font-semibold text-gray-800">{n.title}</h4>
                  <p className="text-gray-600 text-sm">{n.message}</p>
                  <span className="text-xs text-gray-400 mt-1 block">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
                <Image
                  src="/nearbuydukan - watermark.png"
                  alt="Watermark"
                  fill 
                  className="object-contain w-17 h-17 md:w-32 md:h-32"
                  priority
                />
        </div>      
      </section>
    </>
  );
}

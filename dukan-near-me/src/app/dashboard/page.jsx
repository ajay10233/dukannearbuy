"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "@/app/components/LogoutButton";
import ChangePastAddress from "../components/ChangePastAddress";
import QRCodeComponent from "../components/QRCodeComponent";
import { useUser } from '@/context/UserContext';
import toast, { Toaster } from "react-hot-toast";
// import other components as needed
export default function Dashboard() {
  const { user, socket, loading, fetchUserDetails } = useUser();
  
  const [notifyData, setNotifyData] = useState({
    toUserId: "",
    title: "",
    message: "",
  });
  const [notificationStatus, setNotificationStatus] = useState("");

  const handleNotifyChange = (e) => {
    const { name, value } = e.target;
    setNotifyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    console.log("Sending notification:", notifyData);
    socket?.emit("sendNotification", notifyData);
    // try {
    //   await axios.post("/api/notify", notifyData);
    //   setNotificationStatus("✅ Notification sent!");
    //   setNotifyData({ toUserId: "", title: "", message: "" });
    // } catch (err) {
    //   console.error("❌ Notification error:", err);
    //   setNotificationStatus("❌ Failed to send notification.");
    // }
  };

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="p-4">
      <h1>Welcome, {user.firstName + " " + user.lastName}!</h1>
      <p className="lowercase">Your role: {user.role}</p>

      <button type="button" className="btn btn-primary my-2" onClick={fetchUserDetails}>
        Fetch Details
      </button>

      <QRCodeComponent params={{ id: user.id }} />

      {/* Notification Form */}
      <div className="my-4">
        <h3>Send Notification</h3>
        <form onSubmit={handleSendNotification}>
          <div>
            <label>User ID to Notify:</label>
            <input
              type="text"
              name="toUserId"
              value={notifyData.toUserId}
              onChange={handleNotifyChange}
              className="form-control my-1"
              required
            />
          </div>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={notifyData.title}
              onChange={handleNotifyChange}
              className="form-control my-1"
              required
            />
          </div>
          <div>
            <label>Message:</label>
            <textarea
              name="message"
              value={notifyData.message}
              onChange={handleNotifyChange}
              className="form-control my-1"
              required
            />
          </div>
          <button type="submit" className="btn btn-success mt-2">Send Notification</button>
        </form>
        {notificationStatus && <p className="mt-2">{notificationStatus}</p>}
      </div>
    </div>
  );
}

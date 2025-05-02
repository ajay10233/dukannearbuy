"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "@/app/components/LogoutButton";
import ChangePastAddress from "../components/ChangePastAddress";
import QRCodeComponent from "../components/QRCodeComponent";
// import other components as needed

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const HandleDeleteAccount = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.delete("/api/auth/delete-account");
      console.log("🔐 Full User Data:", res.data) ;
    } catch (error) { 
      console.error("❌ Failed to fetch user details:", error);
    }
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/me");
        console.log("🔐 Full User Data:", res.data);
        setUser(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch user details:", error);
      }
      try {
        const res = await axios.get("/api/reviews/");
        console.log("🔐 Full reviews Data:", res.data);
        setUser(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  if (!user) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName + " " + user.lastName}!</h1>
      <p className="lowercase">Your role: {user.role}</p>
      <LogoutButton />
      <button onClick={(event)=>HandleDeleteAccount(event)}>Delete account</button>
      <QRCodeComponent params={{ id: user.id }} />
    </div>
  );
}

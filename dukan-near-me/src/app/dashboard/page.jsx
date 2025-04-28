"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "@/app/components/LogoutButton";
import ChangePastAddress from "../components/ChangePastAddress";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/me");
        console.log("🔐 Full User Data:", res.data);
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
      {/* <ReviewComponent user={user}/>
      <QRCodeComponent params={{ id: user.id }} />
      <EditInstitution />
      <ClientQRCodeSection /> */}
      <ChangePastAddress />
    </div>
  );
}

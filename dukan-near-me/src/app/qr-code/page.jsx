"use client"
import React from 'react'
import QRCodeComponent from '../components/QRCodeComponent'
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from '../components/InstitutionHome/navbar/Navbar';

const page = () => {
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
  return (
    <div>
      {/* <QRCodeComponent params={{ id: user?.id }} /> */}
      <Navbar/>
        <QRCodeComponent
          params={{
            id: user?.id,
            username: user?.username,
            role: user?.role,
          }}
        />
    </div>
  )
}

export default page
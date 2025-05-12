"use client";

import React, { useEffect, useState } from "react";
import QRCodeComponent from "../components/QRCodeComponent";
import axios from "axios";
import Navbar from "../components/InstitutionHome/navbar/Navbar";
import { Grid } from "react-loader-spinner";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.get("/api/users/me");
        console.log("🔐 Full User Data:", res.data);
        setUser(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

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
    <div>
      <Navbar />
      {user && (
        <QRCodeComponent
          params={{
            id: user?.id,
            username: user?.username,
            role: user?.role,
          }}
        />
      )}
    </div>
  );
};

export default Page;

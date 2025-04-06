// app/institution/[institutionId]/create/page.jsx
"use client";
import { useState } from "react";
import axios from "axios";
export default function CreateToken() {
  const [userId, setUserId] = useState("");
  const handleCreateToken = async () => {
    if (!userId) return alert("Please enter a user ID");
    try {
      const response = await axios.post("/api/token/create", { userId });
      console.log("Token created:", response.data);
      // Optionally, emit socket event here if needed
    } catch (error) {
      console.error("Error creating token", error);
    }
  };

  return (
    <div>
      <h1>Create Token</h1>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button onClick={handleCreateToken} style={{cursor:"pointer"}}>Create Token</button>
    </div>
  );
}

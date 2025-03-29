"use client";
import { useEffect, useState } from "react";
import { LogOut, Smartphone, Globe } from "lucide-react";
import toast from "react-hot-toast";

export default function SessionManager() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  const logoutDevice = async (sessionToken) => {
    const res = await fetch("/api/logout-device", {
      method: "POST",
      body: JSON.stringify({ sessionToken }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setSessions((prevSessions) => prevSessions.filter((s) => s.token !== sessionToken));
      toast.success("Device logged out successfully!");
    } else {
      toast.error("Failed to logout device.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Active Sessions</h2>
      
      {sessions.length > 0 ? (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-gray-800 font-medium">{session.device || "Unknown Device"}</p>
                  <p className="text-gray-600 text-sm flex items-center">
                    <Globe className="w-4 h-4 mr-1 text-gray-500" />
                    {session.ip || "Unknown IP"}
                  </p>
                  <p className="text-gray-500 text-xs">{new Date(session.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => logoutDevice(session.token)} 
                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No active sessions found.</p>
      )}
    </div>
  );
}

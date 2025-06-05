"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Image from "next/image";
import LogoLoader from "../LogoLoader";

export default function Feedback() {
  const [formData, setFormData] = useState({
    type: "",
    content: "",
    name: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 500); 

    return () => clearTimeout(timer);
  }, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/feedback/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`${formData.type === "FEEDBACK" ? "Feedback" : "Complaint"} submitted successfully!`);
        setFormData({ type: "", content: "", name: "", email: "" });
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

    if (loading) {
    return <LogoLoader content={"Loading page, please wait..."} />;
  }


  return (
    <div className="h-screen relative flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-slate-100 to-white-200 p-6"> 
      <motion.p
            className="absolute top-16 left-8 text-[16px] md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-500 to-indigo-600 mb-6"
            animate={{ scale: 1.1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
          >
            Local Market, Hyper Services
          </motion.p>
      
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-4 md:p-8 rounded-2xl shadow-xl w-full max-w-4xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Connect with our Support Team</h2>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 p-2 rounded-md cursor-pointer transition-all ease-in-out duration-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          <option value="" disabled hidden>Select an option</option>
          <option value="FEEDBACK">Feedback</option>
          <option value="COMPLAINT">Complaint</option>
        </select>


          <textarea
            name="content"
            rows={4}
            placeholder="Type your message..."
            value={formData.content}
            onChange={handleChange}
            maxLength={1000}
            className="w-full dialogScroll border border-gray-300 p-2 rounded-md cursor-pointer transition-all ease-in-out duration-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-700"
            required
          />
          {formData.content.length === 1000 && (
            <p className="text-red-500 text-xs font-medium text-right">
              You have reached the maximum character limit.
            </p>
          )}

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border capitalize border-gray-300 p-2 rounded-md cursor-pointer transition-all ease-in-out duration-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-md cursor-pointer transition-all ease-in-out duration-400 focus:outline-none focus:ring-2 focus:ring-blue-700"
          required
        />

        <motion.button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white py-2 rounded-md cursor-pointer font-semibold transition-all duration-300
            bg-gradient-to-r from-teal-300 via-[#219ebc] to-indigo-400 
            hover:opacity-90 active:scale-95
            ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Sending..." : "Send"}
        </motion.button>

        </motion.form>
        
        <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
            <Image
                src="/nearbuydukan - watermark.png"
                alt="Watermark"
                fill size="120"
                className="object-contain w-17 h-17 md:w-32 md:h-32"
                priority />
        </div>      
    </div>
  );
}

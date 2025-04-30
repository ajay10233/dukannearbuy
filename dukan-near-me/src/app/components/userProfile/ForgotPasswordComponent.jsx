// // pages/forgot-password.tsx
// "use client"
// import { useState } from 'react';

// export default function ForgotPasswordComponent() {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const res = await fetch('/api/auth/forgot-password', {
//       method: 'POST',
//       body: JSON.stringify({ email }),
//       headers: { 'Content-Type': 'application/json' },
//     });
//     const data = await res.json();
//     setMessage(data.message);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         placeholder="Your email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         required
//       />
//       <button type="submit">Send Reset Link</button>
//       {message && <p>{message}</p>}
//     </form>
//   );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ForgotPasswordComponent() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMessage(data.message);
      setLoading(false);

  };

  return (
      <div className='bg-gradient-to-bl from-[#e7f0ec] via-[#aabec2] to-[#0a94ad]'>
        <header>
            <div className="w-full p-4 flex items-center gap-x-2">
              <div className="relative w-12.5 h-12.5">
                  <Image src="/nearbuydukan-Logo/Logo.svg" alt="nearbuydukan" fill sizes='50px' priority/>
              </div>
                <span className="font-semibold text-sm uppercase">nearbuydukan</span>
            </div>
        </header>
    
        <section className="h-[calc(100vh-82px)] flex justify-center items-start pt-16 px-4 relative">
          <div className="w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6 border border-gray-400 bg-white/10 backdrop-blur-md">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Forgot your password?
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border rounded-full outline-none px-5 py-3 pl-6 md:pl-12 text-sm md:text-base peer text-gray-600"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 w-full py-3 text-white text-sm md:text-base rounded-full font-semibold cursor-pointer ease-in-out hover:bg-blue-700 transition duration-300"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {message && (
              <p className="text-center text-sm text-green-600 font-medium">
                {message}
              </p>
            )}

            <div className="text-center text-sm text-gray-600">
              Back to{" "}
              <Link href="/login" className="text-blue-600 cursor-pointer ease-in-out hover:text-blue-700 transition duration-300 font-medium">
                Login
              </Link>
            </div>
            </div>
              
            <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
                        <Image
                            src="/nearbuydukan - watermark.png"
                            alt="Watermark"
                            fill size="120"
                            className="object-contain w-17 h-17 md:w-32 md:h-32"
                            priority
                        />
            </div>    
        </section>
      </div>
   );
}

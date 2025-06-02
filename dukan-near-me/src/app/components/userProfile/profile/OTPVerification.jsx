'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LockKeyhole, RefreshCcw } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

export default function OTPVerification() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidAttempt, setInvalidAttempt] = useState(false);
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [isVerified, setIsVerified] = useState(false);


  useEffect(() => {
    if (showOTPSection && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showOTPSection, timer]);

  const handleEmailSubmit = async () => {
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.post('/api/users/verification', { email });

      toast.success(res.data?.message || `OTP sent to ${email}`);
      setShowOTPSection(true);
      setTimer(60);
    } catch (err) {
      setInvalidAttempt(true);
      toast.error(err.response?.data?.error || 'Failed to send OTP. Try again.');
      clearInputs();
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const clearInputs = () => {
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      toast.error('Please enter the 4-digit OTP');
      return;
    }

    setIsLoading(true);
    setInvalidAttempt(false);

    try {
      const res = await axios.post('/api/users/verify', {
        email,
        emailOtp: enteredOtp,
      });

      toast.success(res.data?.message || 'OTP Verified');
      setIsVerified(true);
      setTimer(0);    
      
      router.push('/userProfile');
    } catch (err) {
      setInvalidAttempt(true);
      toast.error(err.response?.data?.error || 'Wrong OTP. Try again!');
      clearInputs();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(60);
    setIsVerified(false);
    clearInputs();
    toast.success('OTP Sent Again');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-yellow-100 px-4 relative">
      <div className="w-full max-w-md p-8 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl border border-blue-200">

        <h2 className="text-3xl font-bold text-center text-blue-900 mb-4 flex items-center justify-center gap-2">
          <LockKeyhole size={28} fill="#f0d000" color="#65645d" />
          Email Verification
        </h2>

        {!showOTPSection && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all ease-in-out duration-400 cursor-pointer focus:ring-blue-500"
            />
            <button
              onClick={handleEmailSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all ease-in-out duration-400 cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Send Verification OTP'}
            </button>
          </>
        )}

        {showOTPSection && (
          <>
            <p className="text-center text-gray-600 text-sm mb-6 mt-4">
              Enter the 4-digit code sent to <span className="font-medium text-blue-800">{email}</span>
            </p>

            <div className="flex justify-between gap-3 mb-5">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleBackspace(e, i)}
                  className="w-12 h-14 text-center border-2 border-blue-300 rounded-lg text-2xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ease-in-out duration-400 cursor-pointer"
                />
              ))}
            </div>

            {invalidAttempt && (
              <p className="text-red-500 text-sm text-center mb-3">Invalid OTP, please try again.</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-semibold shadow-md hover:opacity-90 transition-all ease-in-out duration-400 cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center mt-5 text-sm text-gray-600 flex justify-center cursor-pointer">
              {(timer > 0 && !isVerified) ? (
                <p>
                  Resend in <span className="font-medium">{timer}s</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-blue-600 font-medium hover:underline transition-all ease-in-out duration-400 cursor-pointer flex items-center gap-2"
                >
                  <RefreshCcw size={24} color="#1851d8" /> Resend OTP
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-1 right-4 w-32 h-32">
        <Image
          src="/nearbuydukan - watermark.png"
          alt="Watermark"
          fill sizes='128px'
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}

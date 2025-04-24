'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { LockKeyhole, RefreshCcw } from 'lucide-react';
import Image from 'next/image';

export default function OTPVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get('email') || 'example@mail.com';
  const phone = searchParams.get('phone') || '+91-9876543210';

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidAttempt, setInvalidAttempt] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
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

  const handleSubmit = () => {
    const enteredOtp = otp.join('');
    setIsLoading(true);
    setInvalidAttempt(false);

    setTimeout(() => {
      if (enteredOtp === '1234') {
        toast.success('OTP Verified');
        router.push('/userProfile');
      } else {
        setInvalidAttempt(true);
        toast.error('Wrong OTP. Try again!');
        clearInputs();
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    setTimer(60);
    clearInputs();
    toast.success('OTP Sent Again');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-yellow-100 px-4 relative">
      <div className="w-full max-w-md p-8 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl border border-blue-200">
        <h2 className="text-3xl font-bold text-center text-blue-900 mb-2 flex items-center justify-center gap-2">
            <LockKeyhole size={28} fill="#f0d000" color="#65645d" />
            OTP Verification
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter the 4-digit code <br /> sent to {" "}
          <span className="font-medium text-blue-800">{email}</span> & <span className="font-medium text-blue-800">{phone}</span>
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
              className="w-12 h-14 text-center border-2 border-blue-300 rounded-lg text-2xl bg-white shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          ))}
        </div>

        {invalidAttempt && (
          <p className="text-red-500 text-sm text-center mb-3">Invalid OTP, please try again.</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 cursor-pointer rounded-lg font-semibold shadow-md hover:opacity-90 transition"
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>

        <div className="text-center mt-5 text-sm text-gray-600 flex justify-center cursor-pointer">
          {timer > 0 ? (
            <p>
              Resend in <span className="font-medium">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 font-medium hover:underline transition flex  items-center gap-2"
            >
              <RefreshCcw size={24} color="#1851d8" /> Resend OTP
            </button>
          )}
        </div>
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
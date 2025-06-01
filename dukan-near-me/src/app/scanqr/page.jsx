'use client';

import React, { useState, useEffect } from 'react';
import Scanner from '../components/qr-scanner/Scanner';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react'; 
import Navbar from '../components/userProfile/navbar/Navbar';
import LogoLoader from '../components/LogoLoader';

function Page() {
    const [scannerReady, setScannerReady] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setScannerReady(true), 500);
      return () => clearTimeout(timer);
    }, []);

  if (!scannerReady) {
    return (
      <LogoLoader content={"Initializing QR scanner..."} />
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 w-full max-w-lg">
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-700 mb-3 md:mb-6">QR Code Scanner</h1>
          <div className="text-center text-gray-500 mb-2 md:mb-4">
            <p>Scan a QR code using your camera</p>
          </div>
          <Scanner />
        </div>
      </div>
    </>
  );
}

export default Page;

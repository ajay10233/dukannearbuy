'use client';

import React, { useState, useEffect } from 'react';
import QrScanner from '../components/qr-scanner/QrScanner';
import Navbar from '../components/InstitutionHome/navbar/Navbar';
import Link from 'next/link';
import { MoveLeft } from 'lucide-react';
import { Grid } from 'react-loader-spinner';

function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); 
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
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
    <>
      <Navbar />
      <div className="relative flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <Link
          href="/tokengenerate"
          className="absolute top-12 left-4 flex items-center gap-1 text-gray-500 hover:text-teal-800 cursor-pointer transition-all duration-400 ease-in-out mt-4"
        >
          <MoveLeft size={20} strokeWidth={1.5} />
          <span className="text-sm md:text-base font-medium">Back</span>
        </Link>
        <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 w-full max-w-lg">
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-gray-700 mb-3 md:mb-6">
            QR Code Scanner
          </h1>
          <div className="text-center text-gray-500 mb-2 md:mb-4">
            <p>Scan a QR code using your camera</p>
          </div>
          <QrScanner />
        </div>
      </div>
    </>
  );
}

export default Page;

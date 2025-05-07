'use client';

import React from 'react';
import QrScanner from '../components/qr-scanner/QrScanner';
import Navbar from '../components/InstitutionHome/navbar/Navbar';

function Page() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">QR Code Scanner</h1>
          <div className="text-center text-gray-500 mb-4">
            <p>Scan a QR code using your camera</p>
          </div>
          <QrScanner />
        </div>
      </div>
    </>
  );
}

export default Page;

'use client';

import { QRCodeCanvas } from 'qrcode.react';

export default function QRCodeComponent({ params }) {
  console.log(params);
  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/profile/${params.id}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Scan QR to View Profile</h1>
      <QRCodeCanvas
        value={profileUrl}
        size={256}
        imageSettings={{
          src: '/nearbuydukan-Logo/Logo.svg', 
          x: undefined,
          y: undefined,
          height: 50,
          width: 50,
          excavate: true, 
        }}
      />
      <p className="mt-4 text-gray-500">User ID: {params.id}</p>
    </div>
  );
}

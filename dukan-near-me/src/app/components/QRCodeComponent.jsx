// 'use client';

// import { QRCodeCanvas } from 'qrcode.react';

// export default function QRCodeComponent({ params }) {
//   const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/partnerProfile/${params.id}`;
// console.log("Profile URL:", profileUrl);
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Scan QR to View Profile</h1>
//       <QRCodeCanvas
//         value={profileUrl}
//         size={256}
//         imageSettings={{
//           src: '/nearbuydukan-Logo/Logo.svg',
//           x: undefined,
//           y: undefined,
//           height: 100,
//           width: 100,
//         //   excavate: true,
//         }}
//       />
//       <p className="mt-4 text-gray-500">User ID: {params.id}</p>
//     </div>
//   );
// }


"use client";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeComponent({ params }) {
  const { username, role } = params;

  const route =
    role === "USER"
      ? "userProfile"
      : role === "INSTITUTION" || role === "SHOP_OWNER"
      ? "partnerProfile"
        : "login"; 
  
  
  const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${route}/${params.id}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Scan QR to View Profile</h1>
      <QRCodeCanvas
        value={profileUrl}
        size={256}
        imageSettings={{
          src: "/nearbuydukan-Logo/Logo.svg",
          height: 100,
          width: 100,
        }}
      />
      <p className="mt-4 text-gray-500">Username: {username}</p>
    </div>
  );
}

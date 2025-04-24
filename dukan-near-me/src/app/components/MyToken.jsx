import Image from "next/image";
import React from "react";

const tokens = [
  {
    id: 1,
    tokenNumber: "TKN-00123",
    firmName: "Techify Solutions",
    username: "john_doe",
    date: "2025-04-22",
  },
  {
    id: 2,
    tokenNumber: "TKN-00124",
    firmName: "HealthCare Plus",
    username: "jane_smith",
    date: "2025-04-23",
  },
  {
    id: 3,
    tokenNumber: "TKN-00125",
    firmName: "EduWorld Academy",
    username: "admin_edu",
    date: "2025-04-24",
  },
];

export default function MyToken() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-white via-slate-100 to-slate-200 p-6">
      <div className="w-full max-w-6xl flex flex-col justify-center gap-6 mx-auto pt-16">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          My Assigned Tokens
        </h1>

        <div className="overflow-x-auto shadow-xl rounded-xl border border-slate-300 bg-white backdrop-blur-sm">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gradient-to-r from-blue-700 to-teal-500 text-white">
              <tr>
                <th scope="col" className="px-6 py-4 tracking-wider">
                  Token Number
                </th>
                <th scope="col" className="px-6 py-4 tracking-wider">
                  Firm Name
                </th>
                <th scope="col" className="px-6 py-4 tracking-wider">
                  Assigned By
                </th>
                <th scope="col" className="px-6 py-4 tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tokens.map((token) => (
                <tr
                  key={token.id}
                  className="hover:bg-slate-100 transition duration-200"
                >
                  <td className="px-6 py-4 font-semibold text-blue-700">
                    {token.tokenNumber}
                  </td>
                  <td className="px-6 py-4">{token.firmName}</td>
                  <td className="px-6 py-4">{token.username}</td>
                  <td className="px-6 py-4">{token.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
        <Image
          src="/nearbuydukan - watermark.png"
          alt="Watermark"
          fill
          className="object-contain w-17 h-17 md:w-32 md:h-32"
          priority
        />
      </div>
    </div>
  );
}

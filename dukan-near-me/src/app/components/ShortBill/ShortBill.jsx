'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, ChevronDown, ChevronUp, ArrowDownToLine } from 'lucide-react';

export default function ShortBill() {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showAmountSort, setShowAmountSort] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [amountSortOrder, setAmountSortOrder] = useState(null); // 'asc' or 'desc'

  const bills = [
    { invoiceNumber: 'INV001', createdAt: '2024-09-01', username: 'user123', totalAmount: 250 },
    { invoiceNumber: 'INV002', createdAt: '2024-09-05', username: 'user456', totalAmount: 150 },
    { invoiceNumber: 'INV003', createdAt: '2024-09-10', username: 'user789', totalAmount: 300 },
  ];

  // Filter by date
  let filteredData = bills.filter(item => {
    const createdAt = new Date(item.createdAt);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && createdAt < from) return false;
    if (to && createdAt > to) return false;
    return true;
  });

  // Sort by amount
  if (amountSortOrder === 'asc') {
    filteredData.sort((a, b) => a.totalAmount - b.totalAmount);
  } else if (amountSortOrder === 'desc') {
    filteredData.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  return (
    <main className="flex flex-col items-center gap-y-6 px-3 md:px-5 bg-[#F0F0F0] h-screen relative overflow-hidden">
      <div className="flex flex-col w-11/12">
        <div className="flex justify-center py-3 text-slate-500">
          <h1 className="font-semibold text-2xl">Short Bill</h1>
        </div>
      </div>

      <div className="flex flex-col gap-y-3 w-11/12 h-full overflow-hidden px-2 py-4">
        {/* Table Header */}
        <div className="flex items-center text-sm capitalize text-slate-400">
          <ul className="flex *:w-1/5 w-full justify-around whitespace-nowrap">
            <li className="justify-center md:flex hidden">Invoice ID/Token No.</li>

            {/* Billing Date Filter */}
            <li className="flex flex-col items-center justify-center relative cursor-pointer">
              <div className="flex items-center gap-x-1" onClick={() => setShowDateFilter(!showDateFilter)}>
                Billing Date <Calendar size={16} className="ml-1 w-4 h-4 text-slate-500 hover:text-teal-700" />
              </div>
              {showDateFilter && (
                <div className="absolute top-9 bg-white border border-gray-300 p-4 rounded-lg shadow-lg z-10 text-black w-60 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    From: <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="w-40 border rounded px-2 py-1 text-sm" />
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    To: <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="w-40 border rounded px-2 py-1 text-sm" />
                  </label>
                </div>
              )}
            </li>

            <li className="flex justify-center">User ID</li>

            {/* Amount Sort Filter */}
            <li className="md:flex hidden flex-col items-center justify-center relative cursor-pointer">
              <div className="flex items-center gap-x-1" onClick={() => setShowAmountSort(!showAmountSort)}>
                Amount{" "}
                {showAmountSort ? (
                  <ChevronUp size={16} className="ml-1 w-4 h-4 text-slate-500 hover:text-teal-700" />
                ) : (
                  <ChevronDown size={16} className="ml-1 w-4 h-4 text-slate-500 hover:text-teal-700" />
                )}
              </div>
              {showAmountSort && (
                <div className="absolute top-9 bg-white border border-gray-300 p-3 rounded-lg shadow-lg z-10 text-black w-40 space-y-1">
                  <p
                    className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-sm"
                    onClick={() => {
                      setAmountSortOrder('asc');
                      setShowAmountSort(false);
                    }}
                  >
                    Low to High
                  </p>
                  <p
                    className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-sm"
                    onClick={() => {
                      setAmountSortOrder('desc');
                      setShowAmountSort(false);
                    }}
                  >
                    High to Low
                  </p>
                </div>
              )}
            </li>

            {/* Download */}
            <li className="flex flex-col items-center justify-center relative cursor-pointer">
              Download
            </li>
          </ul>
        </div>

        {/* Table Body */}
        <div className="flex flex-col gap-y-3 overflow-y-scroll dialogScroll h-full">
          {filteredData.map((bill, i) => (
            <div className="flex items-center bg-gray-100 p-2 py-3 rounded-lg" key={i}>
              <ul className="flex items-center text-sm text-slate-600 *:w-1/5 w-full text-center justify-around whitespace-nowrap">
                <li className="md:flex flex-col items-center hidden">{bill.invoiceNumber}</li>
                <li>{new Intl.DateTimeFormat('en-GB').format(new Date(bill.createdAt))}</li>
                <li>{bill.username}</li>
                <li className="md:flex flex-col items-center hidden">{bill.totalAmount}</li>
                <li className="flex flex-col items-center justify-center relative">
                  <span className='text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out'>
                    <ArrowDownToLine size={17} strokeWidth={2.5} color="#fff" />
                  </span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
        <Image
          src="/nearbuydukan - watermark.png"
          alt="Watermark"
          fill
          sizes="120"
          className="object-contain w-17 h-17 md:w-32 md:h-32"
          priority
        />
      </div>
    </main>
  );
}

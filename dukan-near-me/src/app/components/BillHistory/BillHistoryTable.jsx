"use client"

import React, { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function BillHistoryTable() {
  const originalData = [
    { invoiceId: '#10001', billingDate: "10 Jan 2025", customerName: 'Hare Krsna', amount: "₹500", status: "Pending" },
    { invoiceId: '#10002', billingDate: "15 Mar 2024", customerName: 'Hare Krsna', amount: "₹200", status: "Paid" },
    { invoiceId: '#10003', billingDate: "05 Mar 2024", customerName: 'Hare Krsna', amount: "₹800", status: "Pending" },
    { invoiceId: '#10004', billingDate: "20 Apr 2023", customerName: 'Hare Krsna', amount: "₹100", status: "Paid" },
    { invoiceId: '#10005', billingDate: "18 Dec 2024", customerName: 'Hare Krsna', amount: "₹100", status: "Paid" },
    { invoiceId: '#10006', billingDate: "29 Nov 2023", customerName: 'Hare Krsna', amount: "₹100", status: "Pending" },
  ];

  const [data, setData] = useState(originalData);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showAmountSort, setShowAmountSort] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      const filtered = originalData.filter(d => {
        const date = new Date(d.billingDate);
        return date >= from && date <= to;
      });
      setData(filtered);
    } else {
      setData(originalData);
    }
  }, [fromDate, toDate]);

  const sortAmount = (order) => {
    const sorted = [...data].sort((a, b) => {
      const aNum = parseInt(a.amount.replace(/[^\d]/g, ''));
      const bNum = parseInt(b.amount.replace(/[^\d]/g, ''));
      return order === 'asc' ? aNum - bNum : bNum - aNum;
    });
    setData(sorted);
    setShowAmountSort(false);
  };

  const filterStatus = (status) => {
    const filtered = status === 'All' ? originalData : originalData.filter(d => d.status === status);
    setData(filtered);
    setShowStatusFilter(false);
  };

  return (
    <div className="flex flex-col gap-y-3 cursor-default w-full overflow-hidden h-full">
      <div className="flex items-center text-sm capitalize text-slate-400 px-2">
        <ul className="flex *:w-1/5 w-full">
          <li className="flex justify-center">Invoice ID</li>

          {/* Billing Date Filter */}
          <li className="flex flex-col items-center justify-center relative cursor-pointer">
            <div className="flex items-center gap-x-1" onClick={() => setShowDateFilter(!showDateFilter)}>
              Billing Date <Calendar size={16} className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700" />
            </div>
            {showDateFilter && (
              <div className="absolute top-9 bg-white border border-gray-300 p-4 rounded-lg shadow-lg z-10 text-black w-52 space-y-2">
                <label className="block text-sm font-medium text-gray-600">From:
                  <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="mt-1 w-full border rounded px-2 py-1 text-sm" />
                </label>
                <label className="block text-sm font-medium text-gray-600">To:
                  <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="mt-1 w-full border rounded px-2 py-1 text-sm" />
                </label>
              </div>
            )}
          </li>

          <li className="flex justify-center">Customer</li>

          {/* Amount Sort Filter */}
          <li className="flex flex-col items-center justify-center relative cursor-pointer">
            <div className="flex items-center gap-x-1" onClick={() => setShowAmountSort(!showAmountSort)}>
              Amount <ChevronDown size={16} className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700"/>
            </div>
            {showAmountSort && (
              <div className="absolute top-9 bg-white border border-gray-300 p-3 rounded-lg shadow-lg z-10 text-black w-40 space-y-1">
                <p onClick={() => sortAmount('asc')} className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-sm">Low to High</p>
                <p onClick={() => sortAmount('desc')} className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-sm">High to Low</p>
              </div>
            )}
          </li>

          {/* Status Filter */}
          <li className="flex flex-col items-center justify-center relative cursor-pointer">
            <div className="flex items-center gap-x-1" onClick={() => setShowStatusFilter(!showStatusFilter)}>
              Status <ChevronDown size={16} className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700" />
            </div>
            {showStatusFilter && (
              <div className="absolute top-9 bg-white border border-gray-300 p-3 rounded-lg shadow-lg z-10 text-black w-40 space-y-1">
                <p onClick={() => filterStatus('All')} className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-sm">All</p>
                <p onClick={() => filterStatus('Paid')} className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-sm">Paid</p>
                <p onClick={() => filterStatus('Pending')} className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-sm">Pending</p>
              </div>
            )}
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-y-4 overflow-y-scroll dialogScroll h-screen">
        {data.length === 0 ? (
          <div className="text-center text-gray-500 py-5">No results found</div>
        ) : (
          data.map((details, i) => (
            <div className="flex items-center bg-white p-2 py-3 rounded-lg" key={i}>
              <ul className="flex items-center text-sm text-slate-500 *:w-1/5 w-full text-center">
                <li>{details.invoiceId}</li>
                <li>{details.billingDate}</li>
                <li>{details.customerName}</li>
                <li>{details.amount}</li>
                <li className="flex justify-center items-center relative">
                  <span className={`${details.status === "Pending" ? `bg-yellow-100 text-yellow-400` : `bg-green-100 text-green-400`} rounded-full block w-1/2 py-2`}>
                    {details.status}
                  </span>
                </li>
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

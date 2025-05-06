"use client"

import React, { useState, useEffect } from "react";
import {
  ArrowDownToLine,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function BillHistoryTable() {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showAmountSort, setShowAmountSort] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [billData, setBillData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillData = async () => {
      try {
        const response = await fetch("/api/bill", {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        });
        const data = await response.json();

        if (data.success) {
          setBillData(data.bills);
          setFilteredData(data.bills); 
        } else {
          console.error("Failed to fetch bills:", data.error);
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillData();
  }, []);

  useEffect(() => {
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      const filtered = billData.filter((bill) => {
        const billDate = new Date(bill.billingDate);
        return billDate >= from && billDate <= to;
      });

      setFilteredData(filtered);
    } else {
      setFilteredData(billData);
    }
  }, [fromDate, toDate, billData]);


  const sortAmount = (order) => {
    const sorted = [...filteredData].sort((a, b) => {
      const aNum = parseInt(a.amount.replace(/[^\d]/g, ""));
      const bNum = parseInt(b.amount.replace(/[^\d]/g, ""));
      return order === "asc" ? aNum - bNum : bNum - aNum;
    });

    setFilteredData(sorted);
    setShowAmountSort(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-y-3 cursor-default w-full overflow-hidden h-full">
      <div className="flex items-center text-sm capitalize text-slate-400 px-2">
        <ul className="flex *:w-1/5 w-full justify-around whitespace-nowrap">
          <li className="justify-center md:flex hidden">Invoice ID</li>

          {/* Billing Date Filter */}
          <li className="flex flex-col items-center justify-center relative cursor-pointer">
            <div className="flex items-center gap-x-1" onClick={() => setShowDateFilter(!showDateFilter)}>
              Billing Date <Calendar size={16} className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700" />
            </div>
            {showDateFilter && (
              <div className="absolute top-9 bg-white border border-gray-300 p-4 rounded-lg shadow-lg z-10 text-black w-60 space-y-2">
                <label className="flex flex-row items-center gap-2 text-sm font-medium text-gray-600">From: {" "}
                  <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} className="mt-1 w-40 border rounded px-2 py-1 text-sm" />
                </label>
                <label className="flex flex-row items-center gap-4 text-sm font-medium text-gray-600">To: {" "}
                  <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} className="mt-1 w-40 border rounded px-2 py-1 text-sm" />
                </label>
              </div>
            )}
          </li>

          <li className="flex justify-center">User Id</li>

          {/* Amount Sort Filter */}
          <li className="md:flex hidden flex-col items-center justify-center relative cursor-pointer">
            <div
              className="flex items-center gap-x-1"
              onClick={() => setShowAmountSort(!showAmountSort)}>
                Amount{" "}
                  {showAmountSort ? (
                    <ChevronUp
                      size={16}
                      className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700"
                    />
                  ) : (
                    <ChevronDown
                      size={16}
                      className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700"
                    />
                  )}
            </div>

                {showAmountSort && (
                  <div className="absolute top-9 bg-white border border-gray-300 p-3 rounded-lg shadow-lg z-10 text-black w-40 space-y-1">
                    <p
                      onClick={() => sortAmount("asc")}
                      className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-sm">
                      Low to High
                    </p>
                    <p
                      onClick={() => sortAmount("desc")}
                      className="hover:bg-gray-100 px-2 py-1 rounded cursor-pointer text-sm">
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

      <div className="flex flex-col gap-y-4 overflow-y-scroll dialogScroll h-screen">
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-500 py-5">No results found</div>
        ) : (
          filteredData.map((bill, i) => (
            <div className="flex items-center bg-white p-2 py-3 rounded-lg" key={i}>
              <ul className="flex items-center text-sm text-slate-500 *:w-1/5 w-full text-center justify-around whitespace-nowrap">
                <li className="md:flex flex-col items-center hidden">{bill.invoiceNumber}</li>
                <li>{new Date(bill.createdAt).toLocaleDateString()}</li>
                <li>{bill.username || "N/A"}</li> 
                <li className="md:flex flex-col items-center hidden">{bill.totalAmount}</li>
                <li className="flex flex-col items-center justify-center relative">
                  <span className='className="text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out"'>
                    <ArrowDownToLine size={17} strokeWidth={2.5} color="#fff"/>
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

"use client"

import React, { useState, useEffect } from "react";
import {
  ArrowDownToLine,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LogoLoader from "../LogoLoader";

export default function BillHistoryTable({ setDates }) {
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showAmountSort, setShowAmountSort] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [billData, setBillData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const handleDownload = async (id) => {
    window.location.href = `/download-bill/${id}`;
  }
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
    // Set "to" date to end of the day to include full day
    to.setHours(23, 59, 59, 999);

    const filtered = billData.filter((bill) => {
      const billDate = new Date(bill.createdAt);
      return billDate >= from && billDate <= to;
    });

    setFilteredData(filtered);
    setDates({ startDate: fromDate, endDate: toDate });
  } else {
    setFilteredData(billData);
    setDates({ startDate: "", endDate: "" });
  }
}, [fromDate, toDate, billData]);


  const sortAmount = (order) => {
    const sorted = [...filteredData].sort((a, b) => {
      const aNum = parseFloat(a.totalAmount.toString().replace(/[^\d.]/g, ""));
      const bNum = parseFloat(b.totalAmount.toString().replace(/[^\d.]/g, ""));
      return order === "asc" ? aNum - bNum : bNum - aNum;
    });

    setFilteredData(sorted);
    setShowAmountSort(false);
  };

  if (loading) {
    return <LogoLoader content={"Fetching bill history..."} />;
  }

  return (
    <div className="flex flex-col gap-3 w-full h-full py-4 md:p-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by username..."
          value={search}
          // onChange={(e) => setSearch(e.target.value)}
           onChange={(e) => {
            const keyword = e.target.value;
            setSearch(keyword);

            const filtered = billData.filter((bill) =>
              (bill.user?.username || "")
                .toLowerCase()
                .includes(keyword.toLowerCase())
            );

            setFilteredData(filtered);
          }}
          className="w-full px-4 py-3 text-sm border border-gray-400 rounded-lg shadow-md focus:ring-2 focus:ring-teal-700 transition-all duration-300 ease-in-out outline-none hover:border-gray-400"
        />
      </div>

      <div className="flex flex-col gap-y-3 cursor-default w-full overflow-hidden h-full">
        <div className="flex items-center text-sm capitalize text-slate-600 px-2 py-3 bg-white/30 border border-gray-300 rounded-xl shadow-sm">
          <ul className="flex *:w-1/5 w-full justify-around whitespace-nowrap font-semibold">
            <li className="justify-center md:flex hidden">Invoice ID</li>

            {/* Billing Date Filter */}
            <li className="flex flex-col items-center justify-center relative cursor-pointer">
              <div className="flex items-center gap-x-1" onClick={() => setShowDateFilter(!showDateFilter)}>
                Billing Date <Calendar size={16} className="ml-1 w-4 h-4 cursor-pointer text-slate-500 hover:text-teal-700" />
              </div>
              {showDateFilter && (
                <div className="absolute top-9 left-0 bg-white border border-gray-300 p-4 rounded-lg shadow-lg z-10 text-black w-60 space-y-2">
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
                <div className="absolute top-9 bg-white border border-gray-300 p-3 font-normal rounded-lg shadow-lg z-10 text-gray-500 w-40 space-y-1">
                  <p
                    onClick={() => sortAmount("asc")}
                    className="hover:bg-gray-100 transition-all ease-in-out duration-500 px-2 py-1 rounded cursor-pointer text-sm">
                    Low to High
                  </p>
                  <p
                    onClick={() => sortAmount("desc")}
                    className="hover:bg-gray-100 px-2 transition-all ease-in-out duration-500 py-1 rounded cursor-pointer text-sm">
                    High to Low
                  </p>
                </div>
              )}
            </li>

            {/* Download */}
            <li className="flex flex-col items-center justify-center relative">
              Download
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-y-2 md:gap-y-4 overflow-y-scroll dialogScroll h-screen">
          {filteredData.length === 0 ? (
            <div className="text-center text-gray-500 py-5">No results found</div>
          ) : (
            filteredData.map((bill, i) => (
              <div className="flex items-center bg-white p-2 py-3 border border-gray-200 rounded-xl shadow-sm" key={i}>
                <ul className="flex items-center *:w-2/5 text-[12px] md:text-sm text-slate-500 w-full text-center justify-around whitespace-nowrap">
                  <li className="md:flex flex-col items-center hidden">{bill?.invoiceNumber}</li>
                  <li>{new Date(bill?.createdAt).toLocaleDateString()}</li>
                  <li>{bill?.user?.username || "N/A"}</li>
                  <li className="md:flex flex-col items-center hidden">{bill?.totalAmount}</li>
                  <li className="flex flex-col items-center justify-center relative">
                    <span className='className="text-white bg-teal-600 p-1.5 rounded-full cursor-pointer hover:bg-teal-700 transition-all duration-500 ease-in-out'>
                      <ArrowDownToLine size={17} strokeWidth={2.5} color="#fff" onClick={() => handleDownload(bill?.id)} />
                    </span>
                  </li>
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

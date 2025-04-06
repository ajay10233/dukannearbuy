"use client"

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function PaymentHistory() {

  const data = [
    { amount: "₹500", status: "Pending", date: "2024-03-10" },
    { amount: "₹200", status: "Completed", date: "2024-03-15" },
    { amount: "₹800", status: "Pending", date: "2024-03-05" },
    { amount: "₹100", status: "Completed", date: "2024-03-20" },
    { amount: "₹100", status: "Conflict", date: "2024-03-20" },
    { amount: "₹100", status: "Completed", date: "2024-03-20" },
    { amount: "₹100", status: "Pending", date: "2024-03-20" },
    { amount: "₹100", status: "Conflict", date: "2024-03-20" },
  ];

  const [filter, setFilter] = useState({ from: "", to: "", status: "All", amountSort: "desc", showDateFilter:false , showStatusFilter: false });

  const handleFilter = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  }

  const filteredData = data
  .filter((item) => {
    if (filter.status !== "All" && item.status !== filter.status) return false;
    if (filter.from && new Date(item.date) < new Date(filter.from)) return false;
    if (filter.to && new Date(item.date) > new Date(filter.to)) return false;
    return true; 
  })
  .sort((a, b) => (filter.amountSort === "asc" ? parseInt(a.amount.replace("₹", "")) - parseInt(b.amount.replace("₹", "")) : parseInt(b.amount.replace("₹", "")) - parseInt(a.amount.replace("₹", ""))));


  return (
    <div className="flex flex-col gap-y-3 mt-5 cursor-default">
      <div className="flex items-center *:w-1/3 text-sm capitalize text-slate-400">
        <div className="flex relative justify-center items-center gap-x-1">
          <h3 className="flex justify-center items-center cursor-pointer" onClick={() => setFilter({...filter , showDateFilter : !filter.showDateFilter})}>
            Billing Date
             {filter.showDateFilter ? <ChevronUp /> : <ChevronDown />}
          </h3>
          {filter.showDateFilter && (
            <div className="absolute top-8 left-0 bg-white p-2 shadow-md rounded-md flex gap-2">
              <input type="date" name="from" value={filter.from} onChange={handleFilter} className="border p-1" />
              <input type="date" name="to" value={filter.to} onChange={handleFilter} className="border p-1" />
            </div>
          )}
        </div>
        <div className="flex justify-center items-center gap-x-1">
          <h3 className="flex justify-center items-center cursor-pointer" onClick={() => setFilter({ ...filter, amountSort: filter.amountSort === "asc" ? "desc" : "asc" })}>
            Amount {filter.amountSort === "asc" ? <ChevronUp /> : <ChevronDown />}
          </h3>
        </div>
        <div className="flex relative justify-center items-center gap-x-1">
          <h3 className="flex justify-center items-center cursor-pointer" onClick={() => setFilter({ ...filter, showStatusFilter: !filter.showStatusFilter })}>
            Status {filter.showStatusFilter ? <ChevronUp /> : <ChevronDown />}
          </h3>
          {filter.showStatusFilter && (
            <div className="absolute top-8 left-0 bg-white p-2 shadow-md rounded-md border flex flex-col">
              <button className="p-1 cursor-pointer hover:bg-gray-100" onClick={() => setFilter({ ...filter, status: "All" })}>All</button>
              <button className="p-1 cursor-pointer hover:bg-gray-100" onClick={() => setFilter({ ...filter, status: "Pending" })}>Pending</button>
              <button className="p-1 cursor-pointer hover:bg-gray-100" onClick={() => setFilter({ ...filter, status: "Completed" })}>Completed</button>
              <button className="p-1 cursor-pointer hover:bg-gray-100" onClick={() => setFilter({ ...filter, status: "Conflict" })}>Conflict</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        {filteredData?.map((details, i) => (
          <div className="flex items-center bg-white p-2 py-3 rounded-lg" key={i}>
            <ul className="flex items-center text-sm text-slate-500 *:w-1/3 w-full text-center"> 
              <li>{details.date}</li>
              <li>{details.amount}</li>
              <li className="flex justify-center"><span className={`${details.status === "Pending" ? `bg-yellow-100 text-yellow-400` : details.status === "Conflict" ? `bg-red-100 text-red-400` : `bg-green-100 text-green-400`} rounded-full block w-3/4 p-0.5`}>{details.status}</span></li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

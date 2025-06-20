"use client";
import { Download } from "lucide-react";
import { FaFileInvoice } from "react-icons/fa";
import BillHistoryTable from "@/app/components/BillHistory/BillHistoryTable";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";

export default function BillHistory() {
  const [dates, setDates] = useState({ "startDate": "", "endDate": "" });
  
  const getFormattedDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDownload = async () => {
    // if (!dates.startDate || !dates.endDate) {
    //   toast.error("Please select both start and end dates.");
    //   return;
    // }

    let { startDate, endDate } = dates;

    if (!startDate || !endDate) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      startDate = getFormattedDate(yesterday);
      endDate = getFormattedDate(tomorrow);
      setDates({ startDate, endDate });
    }

    try {
      const res = await axios.post('/api/bill/download',
        { startDate, endDate },
        {
          responseType: 'blob'  // Important to get file
        }
      )

      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Bills_${startDate}_to_${endDate}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }
  return (
    <main className="flex flex-col items-center gap-y-2 md:gap-y-6 px-3 md:px-5 bg-[#F0F0F0] h-screen">
        <div className="flex flex-col w-11/12 mt-16 md:mt-20">
            <div className="flex justify-center py-3 text-slate-500">
                <h1 className="font-semibold text-xl capitalize">Bill history</h1>
            </div>
            <div className="flex flex-row gap-x-2 justify-between items-center">
                <div className="flex flex-col gap-y-2 md:gap-y-4">
                    {/* <div className="flex flex-col">
                        <Link href="/shortbill"  className="flex justify-center items-center gap-x-2 md:gap-x-3 bg-teal-600 transition-all duration-500 ease-in-out hover:bg-teal-700 text-white py-3 w-30 md:w-40 rounded-xl text-sm font-semibold cursor-pointer">Short Bill <FaFileInvoice size={19} strokeWidth={2.5}/></Link>
                    </div> */}
                    <p className="text-xs text-slate-600 uppercase">Download  your all time payment history</p>
                </div>
                <div className="flex flex-col">
                    <button onClick={handleDownload} className="flex justify-center items-center gap-x-2 md:gap-x-3 bg-teal-600 transition-all duration-500 ease-in-out hover:bg-teal-700 text-white p-2 md:py-3 w-30 md:w-40 rounded-xl text-sm font-semibold cursor-pointer">Download Excel <span className="relative w-5 h-5"><Download size={20} strokeWidth={2.5}/></span></button>
                </div>
            </div>
        </div>
        <div className="flex justify-center w-11/12 h-auto overflow-hidden">
            <BillHistoryTable setDates={setDates}/>
        </div>
          {/* <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
                  <Image src="/nearbuydukan - watermark.png" alt="Watermark" fill sizes="120" className="object-contain w-17 h-17 md:w-32 md:h-32" priority />
            </div> */}
    </main>
  )
}

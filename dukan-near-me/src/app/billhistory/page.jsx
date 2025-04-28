import { Download } from "lucide-react";
import BillHistoryTable from "../components/BillHistory/BillHistoryTable";
import Image from "next/image";

export default function BillHistory() {
  return (
    <main className="flex flex-col items-center gap-y-6 px-3 md:px-5 bg-[#F0F0F0] h-screen">
        <div className="flex flex-col w-11/12">
            <div className="flex justify-center py-3 text-slate-500">
                <h1>Your all time bill history</h1>
            </div>
            <div className="flex flex-row gap-x-2 justify-between items-center">
                <div className="flex flex-col gap-y-2 md:gap-y-4">
                    <h3 className="font-semibold text-lg">Invoice</h3>
                    <p className="text-xs text-slate-600 uppercase">Download  your all time payment history</p>
                </div>
                <div className="flex flex-col">
                    <button className="flex justify-center items-center gap-x-2 md:gap-x-3 bg-teal-600 transition-all duration-500 ease-in-out hover:bg-teal-700 text-white py-3 w-30 md:w-40 rounded-xl text-sm font-semibold cursor-pointer">Download <Download size={19} strokeWidth={2.5}/></button>
                </div>
            </div>
        </div>
        <div className="flex justify-center w-11/12 overflow-hidden">
            <BillHistoryTable />
          </div>
          <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
                  <Image
                    src="/nearbuydukan - watermark.png"
                    alt="Watermark"
                    fill sizes="120"
                    className="object-contain w-17 h-17 md:w-32 md:h-32"
                    priority
                  />
            </div>
    </main>
  )
}

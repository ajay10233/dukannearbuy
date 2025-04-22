'use client';
import { useState } from 'react';
import Bill from './Bill/Bill';
import Report from './Report/Report';
import Sidebar from '../userProfile/navbar/sidebar/Sidebar';
import Link from 'next/link';
import { MoveLeft, UserRound } from 'lucide-react';
import Navbar from '../userProfile/navbar/Navbar';

export default function BillRecord() {
  const [selectedTab, setSelectedTab] = useState('bills');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTab = (tab) => {
    setSelectedTab(tab);
    };   
    
  return (
    <>
      <Navbar />
          <section className="pt-10 pb-6 py-6 z-0 flex flex-col items-center gap-y-3.5 bg-gray-50 h-screen">
      <div className="flex items-center justify-between w-full">
      </div>

      <h1 className="text-3xl font-semibold">Bill Records</h1>
      <div className="relative w-full flex justify-center items-center">
        <Link
          href="/userHomePage"
          className="p-4 absolute left-0 flex items-center gap-1 text-gray-700 hover:text-teal-700 transition-colors">
            <MoveLeft size={20} strokeWidth={1.5} />
            <span className="text-sm">Back</span>
        </Link>

        {/* Toggle Buttons - centered */}
        <div className="flex">
          <button
            className={`px-20 py-3 text-lg rounded-tl-xl rounded-bl-xl transition-all duration-500 cursor-pointer ${selectedTab === 'bills' ? 'bg-teal-700 text-white font-medium' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => toggleTab('bills')}>
              Bills
          </button>
          <button
            className={`px-20 py-3 text-lg rounded-tr-xl rounded-br-xl transition-all duration-500 cursor-pointer ${selectedTab === 'reports' ? 'bg-teal-700 text-white font-medium' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => toggleTab('reports')}>
              Reports
          </button>
        </div>
      </div>

      {/* Displaying Bills or Reports based on selectedTab */}
      {selectedTab === 'bills' ? <Bill /> : <Report />}
    </section>
    </>
  );
}

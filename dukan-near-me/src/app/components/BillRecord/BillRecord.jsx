'use client';
import { useState } from 'react';
import Bill from './Bill/Bill';
import Report from './Report/Report';

export default function BillRecord() {
  const [selectedTab, setSelectedTab] = useState('bills');

  const toggleTab = (tab) => {
    setSelectedTab(tab);
    };   
    
  return (
    <section className="p-6 flex flex-col items-center gap-y-6 bg-gray-50 h-screen">
      <h1 className="text-3xl font-semibold">Bill Records</h1>
      
      {/* Toggle Buttons */}
      <div className="flex flex-row">
        <button
          className={`px-20 py-3 text-lg rounded-tl-xl rounded-bl-xl transition-all duration-500 cursor-pointer ${selectedTab === 'bills' ? 'bg-teal-700 text-white font-medium' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => toggleTab('bills')}
        >
          Bills
        </button>
        <button
          className={`px-20 py-3 text-lg rounded-tr-xl rounded-br-xl transition-all duration-500 cursor-pointer ${selectedTab === 'reports' ? 'bg-teal-700 text-white font-medium' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => toggleTab('reports')}
        >
          Reports
        </button>
      </div>

      {/* Displaying Bills or Reports based on selectedTab */}
      {selectedTab === 'bills' ? <Bill /> : <Report />}
    </section>
  );
}

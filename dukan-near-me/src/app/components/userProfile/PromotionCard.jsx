"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function PromotionCard() {
  const [days, setDays] = useState(1);
  const [isPlatinum, setIsPlatinum] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const costPerDay = 99;
  const totalCost = days * costPerDay;
  const discountedCost = isPlatinum ? totalCost * 0.7 : totalCost;

  const handleDaysChange = (e) => {
    const value = Math.min(14, Math.max(1, Number(e.target.value)));
    setDays(value);
  };

  return (
    <section className="w-full flex flex-col items-center py-10 px-4 gap-y-10">
      <h1 className="text-3xl font-bold mb-6 text-white">Paid Promotion</h1>
      <Dialog>
        <DialogTrigger asChild>
          <div
            className={`cursor-pointer bg-gray-200 transition-all shadow-md rounded-xl p-5 md:px-6 md:py-10 w-full max-w-3xl min-h-[240px] flex flex-col justify-center duration-300 ease-in-out transform ${
              // className={`cursor-pointer bg-white/10 backdrop-blur-md border border-white/20 transition-all shadow-lg rounded-xl p-5 md:px-6 md:py-10 w-full max-w-3xl min-h-[240px] flex flex-col justify-center duration-300 ease-in-out transform ${
              isHovered ? "scale-[1.02]" : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold text-gray-800">
                Unlock visibility boost
              </h2>
              {isPlatinum && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-full shadow">
                  30% OFF
                </span>
              )}
            </div>
            <p className="text-gray-700 mb-1">
              Promote your profile and attract more customers with ease.
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-2">
              <li>₹99 per day</li>
              <li>Maximum 14 days per month</li>
              <li>Special 30% discount for Premium users</li>
            </ul>
            <button className="text-xs bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 text-teal-900 font-semibold shadow-lg transition-all duration-300 rounded-md cursor-pointer px-4 py-3 italic">
              Click to explore your promotion plan
            </button>
          </div>
        </DialogTrigger>
        <DialogContent className="w-80 md:max-w-md animate-fadeIn bg-white">
          <DialogTitle className="text-xl font-semibold">
            Select Promotion Duration
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mb-2">
            Set the number of days and choose a promotion type.
          </DialogDescription>

          <div className="flex flex-col gap-4">
          <label htmlFor="days" className="font-normal">
            Number of Days (1-14)
          </label>
          <input
            type="range"
            id="days"
            min={1}
            max={14}
            value={days}
            onChange={handleDaysChange}
            className="pl-4 border cursor-pointer border-gray-500 rounded-sm w-full"
          />
            {/* <label htmlFor="days" className="font-normal">
              Number of Days (1-14)
            </label>
            <input
              type="number"
              id="days"
              min={1}
              max={14}
              value={days}
              onChange={handleDaysChange}
              className="pl-4 border border-gray-500 rounded-sm"
            /> */}
            <p className="text-sm text-gray-700">
              Cost: ₹{costPerDay} x {days} = ₹{totalCost}
            </p>
            {isPlatinum && (
              <p className="text-sm text-green-600 font-medium">
                Platinum discount applied: ₹{discountedCost.toFixed(2)} total
              </p>
            )}

            <div className="gap-1">
              <label className="block mb-1">Promotion Type</label>
              <select className="w-full border rounded px-2 py-1">
                <option value="sale">On Sale</option>
                <option value="new">New Shop</option>
                <option value="popular">Reach</option>
              </select>
            </div>

            <button className="p-2 bg-black text-white cursor-pointer rounded-md">Confirm Promotion</button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
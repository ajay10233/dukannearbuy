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
import { BadgeIndianRupee, SquareCheckBig, UserPlus, BadgeCheck, Smile, Megaphone, Sparkles, Rocket, Flame, Store} from "lucide-react";
import CustomDropdown from "./CustomDropdown";
import KilometerDropdown from "./KiloMeterDropdown";
import { useRouter } from "next/navigation";

export default function PromotionCard() {
    const [days, setDays] = useState(1);
    const [isPremium, setIsPremium] = useState(false);
    const [selectedKm, setSelectedKm] = useState(5); 
    const [agreed, setAgreed] = useState(false);



    const kmCosts = {
      5: 99,
      20: 199,
      50: 500,
      100: 800,
    };
  
    const costPerKm = kmCosts[selectedKm];
    const totalCost = days * costPerKm;
    const discountedCost = isPremium ? totalCost * 0.7 : totalCost;
  
    const handleDaysChange = (e) => {
      const value = Math.min(14, Math.max(1, Number(e.target.value)));
      setDays(value);
    };
  
    const min = 1;
    const max = 10;
    const percentage = ((days - min) / (max - min)) * 100;
  
  const router = useRouter();

  const handleClick = () => {
    if (!agreed) {
      alert("Please agree to the Terms and Conditions to continue.");
      return;
    }
  
    if (!selectedKm) {
      alert("Please select a distance before continuing.");
      return;
    }
  
    router.push(`/payment?amount=${discountedCost}`);
  };
  
  

  
  return (
    <section className="w-full flex flex-col items-center py-10 px-4 gap-y-10">
      <h1 className="text-3xl font-bold mb-6 text-white flex items-center gap-2 text-shadow-md text-shadow-sky-300">Paid Promotion</h1>
      <Dialog className="font-sans">
        <DialogTrigger asChild>
          <div
            className="cursor-pointer flex-col gap-y-2 bg-gradient-to-r from-pink-100 to-teal-100 transition-all shadow-xl rounded-xl p-6 md:px-8 md:py-12 w-full max-w-4xl min-h-[450px] flex justify-between duration-300 ease-in-out transform"
            // onMouseEnter={() => setIsHovered(true)}
            // onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex flex-col gap-y-2">
                <div className="flex justify-between flex-col gap-y-1">
                    <h2 className="text-[22px] md:text-2xl font-semibold text-start text-gray-800">
                        Expand Your Business 
                    </h2>
                </div>
                <p className="text-gray-600 text-sm md:text-[16px] font-semibold">
                    Are you looking to connect with customers in your area?
                </p>
                <p className="text-gray-600 text-sm flex flex-col gap-y-1">
                Take advantage of this paid advertisement once a month, ensuring fairness for all.
                {/* <br /> */}
                  {" "}The maximum duration is 10 days.
                </p>
            </div>

            {/* <p className="text-gray-600 mb-4 text-sm">
              Is your business struggling to grow? Consider using paid advertising to reach more customers. Just entering the market? Let’s compete as a team.
            </p> */}

            <div className="flex flex-col gap-y-1.5">
                <h3 className="text-lg md:text-xl font-semibold text-gray-700 p-2 md:p-4 whitespace-nowrap">Benefits of Paid Profile Promotion</h3>
                <ul className="text-gray-600 flex flex-col gap-y-1 p-1 md:p-0">
                    <li className="flex items-center gap-2">
                        <span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span>
                        <div>
                            <span className="font-semibold text-sm md:text-[16px]">Top Visibility in Search Results:</span>{" "}<span className="text-sm md:text-[16px]">Your profile appears at the top when customers search for your services.</span> 
                        </div>
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span>
                        <div>
                              <span className="font-semibold text-sm md:text-[16px]">Increased Click-Through Rates (CTR):</span> <span className="text-sm md:text-[16px]">Users are more likely to notice and click your profile first.</span>
                          </div>
                    </li>
                    <li className="flex items-center gap-2">
                    <span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span>
                    <div>
                            <span className="font-semibold text-sm md:text-[16px]">Targeted Reach to Local Customers:</span> <span className="text-sm md:text-[16px]">Get priority placement in location-based searches and reach high-intent buyers.</span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col gap-y-1.5">
                <h3 className="text-lg md:text-xl font-semibold text-gray-700 pl-0 py-2 pr-2 md:p-4 flex items-center gap-2 whitespace-nowrap">
                    <span className="relative w-6 h-6"><BadgeIndianRupee size={24} color="#ffbb00" /></span>
                    Why It's Worth the Investment?
                </h3>
                <ul className="text-gray-600 flex flex-col gap-y-1 p-2 md:px-0">
                    <li className="flex items-center gap-2">
                        <span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span>
                        <span className="text-sm md:text-[16px]" ><span className="font-semibold">Cost-effective marketing</span> (cheaper than traditional ads and flyers).</span>
                    </li>
                    <li className="flex items-center gap-2">
                    <span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span>
                    <span className="text-sm md:text-[16px]"><span className="font-semibold">Faster business growth</span> with real, local customers.</span>
                    </li>
                    <li className="flex items-center gap-2">
                    <span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span>
                    <span className="text-sm md:text-[16px]"><span className="font-semibold">Competitive edge</span> over non-promoted listings.</span>
                    </li>
                </ul>
            </div>

            {/* <div className="flex flex-col gap-y-1.5">
                <h3 className="text-lg font-semibold text-gray-700 p-4">📢 How to Get Started?</h3>
                <ul className="pl-5 text-sm text-gray-600 flex flex-col gap-y-1">
                    <li><span className="font-semibold text-md">Create your profile</span>with attractive images and an effective description.</li>
                    <li><span className="font-semibold text-md">Upgrade your profile</span> to a Paid Plan.</li>
                    <li> Sit back & watch more customers roll in!</li>
                </ul>              
            </div> */}
            <div className="flex flex-col gap-y-1.5">
                <h3 className="text-lg font-semibold text-gray-700 md:p-4 flex items-center gap-2">
                    <Megaphone size={26} color="#f59e0b" />
                    How to Get Started?
                </h3>
                <ul className="text-sm text-gray-600 flex flex-col gap-y-1.5 p-2 md:p-0">
                    <li className="flex items-start gap-2">
                        <span className="relative w-5 h-5"><UserPlus size={20} color="#0ea5e9" /></span>
                        <span>
                        <span className="text-sm md:text-[16px]">
                          <span className="font-semibold">Create your profile</span> with attractive images and an effective description.
                          </span>
                        </span>
                    </li>
                <li className="flex items-start gap-2">
                      <span className="relative w-5 h-5"><BadgeCheck size={20} color="#0ea5e9" /></span>
                        <span className="text-sm md:text-[16px]">
                            <span className="font-semibold">Upgrade your profile</span> to a Paid Plan.
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                    <span className="relative w-5 h-5"><Smile size={20} color="#0ea5e9" /></span>
                    <span className="text-sm md:text-[16px]">Sit back & watch more customers roll in!</span>
                    </li>
                </ul>
            </div>

            <div className="py-4 text-md text-gray-700 flex items-center gap-2 animate-pulse">
                <span className="relative w-6 h-6">
                  <Sparkles size={24} color="#f59e0b" />
                </span>
                <div className="text-sm md:text-[16px]">
                    <span className="text-gray-800 font-semibold">Limited-Time Offer:</span>
                    <div className="text-sm md:text-[16px] py-1 md:p-0">
                      <span className="text-emerald-700 font-semibold">Get 20% OFF</span>{" "}
                      <span>on your first paid promotion!</span>
                    </div>
                </div>
            </div>
                      
            <div className="text-center pb-4">
              <button className="text-sm bg-gradient-to-r from-pink-300 to-teal-300 text-gray-800 font-semibold shadow-md cursor-pointer px-6 py-3 ">
                Start Your Promotion Today
              </button>
            </div>

          </div>
        </DialogTrigger>

        <DialogContent className="w-11/12 md:max-w-4xl min-h-[500px] bg-white">
            <DialogTitle className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2 ">
              <span className="relative w-8 h-8"><Rocket size={32} color="#05fbff" /></span> Grow Your Business Smarter
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Choose how long you'd like to promote your listing and the type of spotlight you want.
            </DialogDescription>

              <div className="flex flex-col gap-4">
                  <div>
                      <KilometerDropdown selectedKm={selectedKm} onKmChange={setSelectedKm} />                 
                  </div>
                            
              {/* no. of days */}
              <label htmlFor="days" className="font-medium text-gray-700">
                Select Duration (1-10 days)
              </label>
              <input
                type="range"
                id="days"
                min={min}
                max={max}
                value={days}
                onChange={handleDaysChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right,
                    #facc15 0%,
                    #ec4899 ${percentage * 0.33}%,
                    #14b8a6 ${percentage * 0.66}%,
                    #3b82f6 ${percentage}%,
                    #e2e2e2 ${percentage}%,
                    #e2e2e2 100%)`
                }}
              />

              <p className="text-sm text-gray-700 flex items-center gap-2">
              <BadgeIndianRupee size={24} color="#ffbb00" /> Total: ₹{costPerKm} x {days} days = <strong>₹{totalCost}</strong>
              </p>

              {isPremium && (
                <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                  <SquareCheckBig color="#14b909" /> Premium Discount Applied! You only pay ₹{discountedCost.toFixed(2)} 🎉
                </p>
              )}

              <div>
                {/* <label className="block p-1 font-medium text-gray-700">Promotion Type</label>
                <select className="w-full border rounded px-2 py-1">
                  <option value="sale"><Flame color="#ffbb00" /> On Sale</option>
                  <option value="new"><Store color="#05fbff" /> New Shop</option>
                  <option value="popular"><Store color="#05fbff" /> Popular Reach</option>
                </select> */}
                  <CustomDropdown />
            </div>
            
            {/* <div className="pt-4 text-sm text-gray-500"> */}
                  {/* By clicking confirm, you agree to our{" "}
                  <Link href="/terms-and-conditions" className="text-teal-500 underline">
                  Terms and Conditions
                  </Link>. */}
                      
                <div className="flex items-center gap-2 pt-4 text-sm text-gray-500">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                    className="w-4 h-4 text-teal-700"
                  />
                  <label htmlFor="agree" className="text-sm text-gray-700">
                    I agree to the terms and conditions.
                  </label>
                </div>

              {/* </div> */}

            
              <button
        onClick={handleClick}
        className={`p-2 flex items-center justify-center gap-2 cursor-pointer bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium rounded-md hover:opacity-90 transition duration-300 ${
          agreed && selectedKm
            ? "bg-emerald-500 text-white hover:bg-emerald-600"
            : ""
        }`}
      >
        <SquareCheckBig color="#fff" /> Confirm and Boost Now
      </button>
            </div>
            
              </DialogContent>

        </Dialog>
    </section>
  );
}
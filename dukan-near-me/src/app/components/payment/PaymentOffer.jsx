"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import LogoLoader from "../LogoLoader";

export default function PaymentOffer() {
  const [coupon, setCoupon] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [invalidCoupon, setInvalidCoupon] = useState(false);
  const [shake, setShake] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [plan, setPlan] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);


  // const price = planId ? parseInt(planId) : 999;
  // const finalPrice = discountApplied ? price - discountAmount : price;

    const params = useParams();
    const planId = params.planId;


  useEffect(() => {
    if (!planId) return;

    fetch(`/api/plans/${planId}`, { method: "GET" }).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch plan");
      return res.json();
    }).then((data) => {
      console.log("_+________________________",data);
      setPlan(data);
    })

      // .then((res) => {
      //   if (!res.ok) throw new Error("Failed to fetch plan");
      //   return res.json();
      // })
      // .then((data) => {
      //   const foundPlan = data.find(p => p.id === planId);
      //   if (foundPlan) {
      //     setPlan(foundPlan);
      //   } else {
      //     toast.error('Plan not found');
      //   }
      // })
      // .catch((error) => {
      //   console.error(error);
      //   toast.error("Could not load plan details.");
      // });
  }, [planId]);

  if (!plan) {
    return <LogoLoader content={"Loading plan details..."}/>;
  }

  const price = plan.price;
  const finalPrice = discountApplied ? price - discountAmount : price;


  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const response = await fetch("/api/coupons", { method: "GET" });
      if (!response.ok) throw new Error("Failed to fetch coupons");

      const coupons = await response.json();

      const matchedCoupon = coupons.find(
        (c) => c.name.toLowerCase() === coupon.trim().toLowerCase()
      );

      if (matchedCoupon) {
        setSelectedCoupon(matchedCoupon); // 🔥 Save full coupon object
        setDiscountApplied(true);
        setInvalidCoupon(false);
        setDiscountAmount(Math.round((price * matchedCoupon.discountPercentage) / 100));

        toast.success(`Coupon "${matchedCoupon.name}" applied! 🎉`);
        setShowSuccessAnim(true);
        setTimeout(() => setShowSuccessAnim(false), 1500);
      } else {
        setInvalidCoupon(true);
        setDiscountApplied(false);
        setDiscountAmount(0);
        setShake(true);
        toast.error("Invalid coupon code ❌");
        setTimeout(() => setShake(false), 500);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while applying coupon.");
    }
  };


  const handleCheckout = async (couponId=null) => {
    try {
      const res = await fetch("/api/plans/upgrade/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId, planId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      if (data.upgraded) {
        toast.success(`Successfully upgraded to ${plan?.name} 🎉`);
        window.location.href = "/";
      } else if (data.stripeUrl) {
        window.location.href = data.stripeUrl; // ⚡ Future Stripe redirection
      }
    } catch (err) {
      toast.error(err.message);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex items-center justify-center p-4 relative">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Complete Your Payment</h2>

        <div className="space-y-3">
          <div className="border rounded-xl p-4 shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Selected Offer</h3>
                <p className="text-sm text-gray-600">{plan?.name+" Plan" || ""}</p>
              </div>
              <div className="text-right">
                {discountApplied ? (
                  <>
                    <p className="text-sm text-gray-500 line-through">₹{price}</p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: showSuccessAnim ? 1.2 : 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-teal-600 font-semibold text-lg"
                    >
                      ₹{finalPrice}
                    </motion.p>
                  </>
                ) : (
                  <div className="text-indigo-600 font-semibold text-lg">₹{price}</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
              Have a Coupon?
            </label>
            <motion.div
              animate={shake ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <input
                id="coupon"
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 border text-sm w-[180px] md:w-full rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 uppercase"
              />

              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 bg-teal-500 text-white rounded-xl cursor-pointer hover:bg-teal-600 transition-all"
              >
                Apply
              </button>
            </motion.div>
            {invalidCoupon && (
              <p className="text-sm text-red-500 mt-1">Invalid coupon code</p>
            )}
          </div>

          <div className="mt-6 border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <p className="font-medium">Total MRP</p>
              <p className="font-medium">₹{price}</p>
            </div>
            {discountApplied && (
              <div className="flex justify-between text-teal-600">
                <p className="font-medium">Coupon Applied</p>
                <p className="font-medium">-₹{discountAmount}</p>
              </div>
            )}
            <div className="flex justify-between text-indigo-600 font-semibold text-lg border-t pt-2">
              <p>Total Amount</p>
              <p>₹{finalPrice}</p>
            </div>
          </div>

         
          <button
            onClick={() => handleCheckout(selectedCoupon?.id)}
            className={`w-full cursor-pointer mt-4 ${finalPrice === 0
              ? "bg-teal-500 hover:bg-teal-600"
              : "bg-indigo-500 hover:bg-indigo-600"
              } text-white font-semibold py-3 rounded-xl shadow-md transition-all ease-in-out duration-400`}
          >
            {finalPrice === 0 ? "Upgrade Now for Free" : "Proceed to Pay"}
          </button>
      

        </div>

        <p className="text-xs text-gray-400 text-center">Secured by Stripe Payments</p>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
        <Image
          src="/nearbuydukan - watermark.png"
          alt="Watermark"
          fill sizes="120"
          className="object-contain w-17 h-17 md:w-32 md:h-32"
          priority
        />
      </div>
    </div>
  );
}

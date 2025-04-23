"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function PaymentOffer() {
  const [coupon, setCoupon] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [invalidCoupon, setInvalidCoupon] = useState(false);
  const [shake, setShake] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === "lucky50") {
      setDiscountApplied(true);
      setInvalidCoupon(false);
      toast.success("Coupon applied successfully!");
      setShowSuccessAnim(true);
      setTimeout(() => setShowSuccessAnim(false), 1500);
    } else {
      setInvalidCoupon(true);
      setDiscountApplied(false);
      setShake(true);
      toast.error("Invalid coupon code ❌");
      setTimeout(() => setShake(false), 500);
    }
  };

  const price = 999;
  const discount = 50;
  const finalPrice = discountApplied ? price - discount : price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center">Complete Your Payment</h2>

        <div className="space-y-3">
          <div className="border rounded-xl p-4 shadow-sm bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">Selected Offer</h3>
                <p className="text-sm text-gray-600">Premium Promotion Package</p>
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
                  <p className="text-indigo-600 font-semibold text-lg">₹{price}</p>
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
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Enter coupon code"
                className="flex-1 border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
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
                <p className="font-medium">-₹{discount}</p>
              </div>
            )}
            <div className="flex justify-between text-indigo-600 font-semibold text-lg border-t pt-2">
              <p>Total Amount</p>
              <p>₹{finalPrice}</p>
            </div>
          </div>

          <button className="w-full cursor-pointer mt-4 bg-gradient-to-r from-indigo-500 to-teal-500 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg hover:from-indigo-600 hover:to-teal-600 transition-all">
            Proceed to Pay
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">Secured by XYZ Payments</p>
      </div>
    </div>
  );
}

"use client";

import { BadgeCheck, XCircle, Sparkles, ArrowRight } from "lucide-react";
import Head from "next/head";
import { motion } from "framer-motion";
import Image from "next/image";

export default function MyPlans() {
  const plans = [
    {
      id: 1,
      name: "Festive Offer",
      type: "promotion",
      status: "active",
      date: "Active till: 25 Apr, 2025",
      description: "Special festive offer with discounts and limited-time perks.",
    },
    {
      id: 2,
      name: "Premium",
      type: "subscription",
      status: "expired",
      date: "Expired on: 12 Mar, 2025",
      description: "Unlimited bill generation, token features, and 30% off on paid promotions.",
    },
    {
      id: 3,
      name: "Business",
      type: "subscription",
      status: "active",
      date: "Active till: 20 Aug, 2025",
      description: "Token management, bill generation for up to 500, weekly marketing emails.",
    },
    {
      id: 4,
      name: "New Product",
      type: "promotion",
      status: "expired",
      date: "Expired on: 04 Apr, 2025",
      description: "Special offer for newly launched products.",
    },
    {
      id: 5,
      name: "New Shop",
      type: "promotion",
      status: "active",
      date: "Active till: 01 Jun, 2025",
      description: "Promotion for newly opened shops with exposure on platform.",
    },
    {
      id: 6,
      name: "Basic",
      type: "subscription",
      status: "expired",
      date: "Expired on: 28 Feb, 2025",
      description: "Limited features with single-device use, encrypted connection, and data privacy.",
    },
    {
      id: 7,
      name: "Reach Campaign",
      type: "promotion",
      status: "active",
      date: "Active till: 15 May, 2025",
      description: "Campaign designed to reach more users and boost visibility.",
    },
    {
      id: 8,
      name: "Sale Blast",
      type: "promotion",
      status: "expired",
      date: "Expired on: 05 Apr, 2025",
      description: "Massive sale campaign for clearing stock quickly.",
    },
  ];

  const sortedPlans = [...plans].sort((a, b) => a.status === "active" ? -1 : 1);

  return (
    <>
        <Head>
            <title>My Plans</title>
        </Head>

        <section className="relative h-screen bg-gradient-to-br from-white via-indigo-50 to-white px-4 sm:px-10 lg:px-20 py-12">
            <div className="w-full max-w-7xl mx-auto relative">

            {/* Sticky Header */}
            <div className="sticky top-0 z-10 py-6">
                <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-indigo-600" />
                My Plans
                </h2>
            </div>

            {/* Scrollable Content */}
            <div className="max-h-[75vh] overflow-y-auto rounded-xl border border-gray-200 dialogScroll">
                <div className="grid grid-cols-1 divide-y divide-gray-100">
                {sortedPlans.map((plan, index) => (
                    <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4 transition-all duration-300 hover:bg-gray-50 ${
                        plan.status === "active"
                        ? "bg-green-50/40 border-l-4 border-green-500"
                        : "bg-white"
                    }`}
                    >
                    <div className="flex flex-col gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                        {plan.name}
                        </h3>
                        <p className="text-sm text-gray-600">{plan.description}</p>
                        <p className="text-xs text-gray-500">{plan.date}</p>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-medium">
                        <span
                        className={`flex items-center gap-1 ${
                            plan.status === "active" ? "text-green-600" : "text-gray-400"
                        }`}
                        >
                        {plan.status === "active" ? (
                            <>
                            <BadgeCheck className="h-4 w-4" /> Active
                            </>
                        ) : (
                            <>
                            <XCircle className="h-4 w-4" /> Expired
                            </>
                        )}
                        </span>
                        {plan.status === "expired" && (
                        <button className="inline-flex cursor-pointer items-center text-indigo-600 hover:text-indigo-800 transition font-semibold text-sm">
                            Renew <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                        )}
                    </div>
                    </motion.div>
                ))}
                </div>
            </div>
            </div>
            <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
                <Image
                    src="/nearbuydukan - watermark.png"
                    alt="Watermark"
                    fill 
                    className="object-contain w-17 h-17 md:w-32 md:h-32"
                    priority
                />
            </div>         
        </section>
    </>
  );
}

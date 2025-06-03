'use client'

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LogoLoader({content}) {
  return (
    <div className="fixed inset-0 z-5000 bg-white flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Spinning circle around the logo */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-teal-400 border-t-transparent animate-spin"
          style={{ borderTopColor: "transparent", borderRadius: "9999px" }}
        />
        {/* Logo in the center */}
        <div className="absolute inset-3">
          <Image
            src="/nearbuydukan-Logo/Logo.svg"
            alt="Loading..."
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
      <p className="mt-4 text-gray-500 text-sm">
        {content}
      </p>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function UnderMaintenancePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-6 md:p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
        >
<img
  src="https://media.giphy.com/media/1GEATImIxEXVR79Dhk/giphy.gif"
  alt="Under Maintenance Animation"
  className="mx-auto mb-6 w-52 h-52 object-contain"
/>


        </motion.div>

        <h1 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">
          This Feature is Under Maintenance 🚧
        </h1>
        <p className="text-gray-700 text-base md:text-lg mb-6">
          We are currently working on improvements. <br />
          Please check back later or contact the concerned developer for more info.
        </p>
        <div className="mt-4">
          <p className="text-blue-700 font-medium">Developer Contact:</p>
          <p className="text-gray-800 font-semibold">Piyush Singh</p>
        </div>

        <Link
          href="/login"
          className="inline-block mt-8 px-6 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition"
        >
          Go Back Home
        </Link>
      </motion.div>
    </main>
  );
}

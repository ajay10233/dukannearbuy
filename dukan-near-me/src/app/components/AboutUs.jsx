"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Store, Stethoscope, Smartphone, SquareCheckBig, MoveRight, Phone, Mail, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from "next/link";
import toast from "react-hot-toast";


const features = [
  {
    icon: <Store className="w-8 h-8 text-indigo-600" />,
    title: "For Shops",
    description: "Digital billing, services listings, and easy billing integration.",
  },
  {
    icon: <Stethoscope className="w-8 h-8 text-emerald-600" />,
    title: "For Healthcare",
    description: "Token generation, patient tracking & billing systems.",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-pink-600" />,
    title: "For Users",
    description: "Discover local services with digital tokens & bill records.",
  },
];

export default function AboutUs() {
  const [showModal, setShowModal] = useState(false);
  const startX = useRef(null);

  const handleDelete = async () => {
    try {
      const res = await fetch('/api/auth/delete-account/', {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Account deleted successfully");
        // redirect to login
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      } else {
        toast.error(data.error || "Failed to delete account");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setShowModal(false);
    }
  };

  const handleStart = (x) => {
    startX.current = x;
  };

  const handleEnd = (x) => {
    if (startX.current !== null && startX.current - x > 50) {
      window.location.href = "https://www.instagram.com/nearbuydukaan?igsh=Zzl0N3AzN2w1cmRu&utm_source=qr";
    }
    startX.current = null; 
  };

  return (
      <main className=" relative bg-gradient-to-br from-teal-50 via-slate-100 to-white">
            <section className="flex justify-center relative text-gray-800 px-6 md:px-20 py-14">
        <div className="w-80 sm:w-full sm:max-w-5xl flex flex-col justify-center items-center text-center gap-4">
        <motion.h1
          className="text-3xl md:text-6xl font-bold text-blue-800"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        >
          About Us
        </motion.h1>
        <p className="text-md md:text-lg text-gray-600 md:mb-12">
          We are first to care for you and your customers. Let's work together for digital and advanced future.
        </p>

        <motion.div 
          className="grid md:grid-cols-2 gap-6 md:gap-10 text-left"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-2">Who We Are</h2>
            <p className="text-sm md:text-[16px] text-gray-700 leading-relaxed">
              At <strong>NearbuyDukaan</strong>, we believe in empowering local businesses and service providers with cutting-edge digital tools. Our platform bridges the gap between traditional markets and modern-day convenience by offering seamless solutions for billing, token generation, and customer management— all in one place.
            </p>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-2">Our Mission</h2>
            <p className="text-sm md:text-[16px] text-gray-700 leading-relaxed">
                To transform the way local shops and healthcare centers operate by providing an accessible, reliable, and hyperlocal digital ecosystem.
            </p>
          </motion.div>
            
        </motion.div>

        <motion.div 
          className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {features.map((item, index) => (
                <motion.div
                    key={index}
                    className="bg-white shadow-xl p-6 rounded-2xl hover:shadow-2xl transition"
                    variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                >
                    <div className="flex items-center justify-between mb-4">
                    <div className="shrink-0">{item.icon}</div>
                    <h3 className="text-center flex-1 font-semibold text-lg text-gray-800">
                        {item.title}
                    </h3>
                    </div>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
            ))}

        </motion.div>

        <div className="mt-4 ml-4 md:ml-0 gap-y-6 md:gap-y-10 text-left flex flex-col">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-2">Why Choose Us?</h2>
            <ul className="pl-6 text-sm md:text-[16px] text-gray-700 leading-loose">
              <li className="flex items-center gap-2"> <span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span> Simple & easy-to-use dashboard</li>
              <li className="flex items-center gap-2"> <span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span> Real-time token & bill generation</li>
              <li className="flex items-center gap-2"><span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span> Hyperlocal focus for real impact</li>
              <li className="flex items-center gap-2"> <span className="relative w-5 h-5"><SquareCheckBig size={20} color="#14b909" strokeWidth={1.5} /></span> Secure and reliable digital infrastructure</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-blue-700 mb-2">Our Vision</h2>
            <p className="text-sm md:text-[16px] text-gray-700">
              To digitize every corner shop, clinic, and small business in India—making local commerce efficient, organized, and future-ready.
            </p>
          </div>

          {/* Founder Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-10 w-full">
            {/* Image */}
            <div className="w-full md:w-1/2 flex justify-center relative">
              <Image 
                src="/founder.png"  
                alt="Founder"
                width={200}
                height={200}
                className="rounded-xl shadow-lg object-cover" priority
              />
            </div>

            {/* Details */}
            <div className="w-full md:w-1/2 text-left flex flex-col gap-y-2 md:gap-y-4">
              <h2 className="text-2xl font-semibold text-blue-700">Meet Our Founder</h2>
              <h3 className="text-xl font-medium text-gray-800">Ajay Sharma</h3>
              <p className="text-gray-700 text-sm md:text-base">
              Ajay Sharma, who started NearbuyDukaan, envisions transforming the local market into a digital space. He aims to provide customers with comfort and a variety of options, allowing them to make quicker, smarter, and more informed decisions. Join our community and participate in the revolution today!.
              </p>
              <div className="flex gap-4 mt-2 text-gray-600">
                <Link
                  href="https://www.linkedin.com/in/ajay-sharma-8b7922183/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl cursor-pointer transition-all ease-in-out duration-500 hover:text-blue-600 flex items-center gap-2">
                    <Linkedin size={20} strokeWidth={1.5} />
                    <span className="text-sm">Connect with us on LinkedIn</span>
                  </Link>
              </div>
            </div>
          </div>
  
          <div className="bg-indigo-50 p-3 md:p-6 rounded-xl text-center mt-4">
            <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">Join Us on Our Journey</h3>
            <p className="text-gray-700 mb-4 text-sm md:text-[16px]">
                Whether you're a small shop owner, clinic manager, or tech-savvy customer—<br />
                NearbuyDukaan is built to simplify your experience and drive growth.
            </p>
              <div className="flex justify-center"
                onTouchStart={(e) => handleStart(e.touches[0].clientX)}
                onTouchEnd={(e) => handleEnd(e.changedTouches[0].clientX)}
                onMouseDown={(e) => handleStart(e.clientX)}
                onMouseUp={(e) => handleEnd(e.clientX)} >
                <button className="flex items-center gap-2 whitespace-nowrap px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition duration-300 shadow-md cursor-pointer">
                <MoveRight size={20} strokeWidth={1.5} /> Be a part of the digital revolution
                </button>
            </div>
            </div>
        </div>
        </div>
    </section>
          
    <section id="help">   
        {/* Help & Support Section */}
        <div className="mt-0 md:mt-12 text-left border-t border-gray-300 w-full px-6 md:px-20 py-10">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Help & Support</h2>
        <p className="text-gray-700 mb-4">
            <span className="font-semibold">Need assistance or have questions? </span> <br/> <span className="text-sm md:text-[16px]">Our team is here to help you get started and stay on track.</span>
        </p>
            <ul className="pl-6 text-gray-700 space-y-2 text-sm md:text-[16px]">
                
                <li className="flex items-center gap-2 cursor-pointer">
                        <ShieldCheck size={20} strokeWidth={1.5} />
                        <Link href="/terms&condition" className="hover:text-blue-700">
                        Terms & Conditions
                        </Link>
                </li>

                {/* <li className="flex items-center gap-2 cursor-pointer">
                    <Phone size={20} strokeWidth={1.5} />
                    Call us at: +91-XXXXXXXXXX
                </li> */}

                <li className="flex items-center gap-2 cursor-pointer">
                    <Mail size={20} strokeWidth={1.5} />
                    <a href="mailto:contact@nearbuydukaan.com" className="hover:text-blue-700">
                      contact@nearbuydukaan.com
                    </a>
                </li>
                      
                <li className="flex items-center gap-2 cursor-pointer">
                    <Instagram size={20} strokeWidth={1.5} />
                    <a
                    href="https://www.instagram.com/nearbuydukaan?igsh=Zzl0N3AzN2w1cmRu&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-700"
                    >
                    Connect with us on Instagram
                    </a>
                </li>
            
                <li className="transition-all ease-in-out duration-500 cursor-pointer hover:text-blue-700 flex items-center gap-2" onClick={() => setShowModal(true)}>
                    <RiDeleteBin6Line size={20} strokeWidth={1.5} />
                    Delete my Account
              </li>
              <AnimatePresence>
                {showModal && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-white p-4 md:p-6 rounded-xl shadow-xl w-75 md:w-full md:max-w-sm text-center"
                    >
                      <h2 className="text-lg font-semibold text-gray-800 mb-3">Are you sure?</h2>
                      <p className="text-sm text-gray-600 mb-4">
                        This action will permanently delete your account and all data.
                      </p>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-4 py-2 bg-gray-100 rounded cursor-pointer transition-all ease-in-out duration-500 hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDelete}
                          className="px-4 py-2 bg-red-500 cursor-pointer transition-all ease-in-out duration-500 text-white rounded hover:bg-red-600"
                        >
                          Yes, Delete
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ul>

        </div>

          </section> 
          <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
            <Image
                src="/nearbuydukan - watermark.png"
                alt="Watermark"
                fill size="120"
                className="object-contain w-17 h-17 md:w-32 md:h-32"
                priority
            />
        </div>      
      </main>
  );
}
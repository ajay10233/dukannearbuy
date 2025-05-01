"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function HomeCards() {
  const cardData = [
    { title: "Live Chat", href: "/chat", slogan: "Connect to The World" },
    { title: "Generate Bills", href: "/bill-generation-page", slogan: "Digital Record" },
    { title: "Generate Token", href: "/tokengenerate", slogan: "Smart Crowd Handling" },
    { title: "Update Live Token", href: "/tokenupdate/${institutionId}", slogan: "Realtime Token Updates" }
  ];
  
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes backgroundMove {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .card-hover-effect {
        background: radial-gradient(circle at 20% 20%, rgba(0, 255, 255, 0.3) 0%, transparent 40%),
                    radial-gradient(circle at 50% 50%, rgba(255, 105, 180, 0.3) 0%, transparent 40%),
                    radial-gradient(circle at 80% 80%, rgba(255, 255, 0, 0.3) 0%, transparent 40%),
                    radial-gradient(circle at 100% 100%, rgba(135, 206, 250, 0.3) 0%, transparent 40%);
        animation: backgroundMove 8s ease infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="min-h-[180vh w-full flex flex-col items-center justify-center gap-10 px-6 md:px-4 py-20">
      {cardData.map((card, index) => (
        <Link href={card.href} key={index} className="w-full max-w-4xl">
          <div className="relative group w-full h-48 sm:h-56 md:h-64 cursor-pointer rounded-xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.02]">
            {/* Swirling color effect inside the card */}
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 card-hover-effect blur-2xl" />
            
            {/* Card content */}
            <div className="relative z-10 h-full w-full flex flex-col items-center justify-center text-white text-center px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{card.title}</h2>
              <p className="text-sm opacity-90">{card.slogan}</p>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}

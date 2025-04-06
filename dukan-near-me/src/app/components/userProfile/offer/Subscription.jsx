'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Check } from "lucide-react";
import Link from 'next/link';

export default function Subscription() {
    const [plans, setPlans] = useState([]);
    const [activePlan, setActivePlan] = useState('');

    const handleClick = () => {
        setActivePlan(plan.title);
    };

    // useEffect(() => {
    //     const fetchPlans = async () => {
    //         const res = await fetch( ); // api
    //         const data = await res.json();
    //         setPlans(data);
    //     };
    //     fetchPlans();
    // }, []);

    const offers = [
        {
          id: 1,
          title: "FREE PLAN",
          price: 0,
          features: [
            "Near by shop",
            "Encrypted Connection",
            "Data Privacy",
            "Works only in single device"
          ],
          image: "/free.png"
        },
        {
          id: 2,
          title: "GOLD PLAN",
          price: 50,
          features: [
            "Token Generation",
            "Token Live",
            "Bill Generation upto 500",
            "Bill record in Excel format",
            "Weekly marketing mail"
          ],
          image: "/gold.png"
        },
        {
          id: 3,
          title: "PLATINUM PLAN",
          price: 120,
          features: [
            "Token Generation",
            "Token Live",
            "Bill Generation Unlimited",
            "Bill record in Excel format",
            "30% off on Paid Promotion"
          ],
          image: "/platinum.png"
        }
    ];
        
    useEffect(() => {
        setPlans(offers);    
    }, []);
    
    return (
        <div className="min-h-screen px-6 py-10 flex items-center justify-center">
            <div className="w-full max-w-[1200px] flex flex-col items-center gap-10">
                <div className="text-center gap-y-2 p-4">
                    <h2 className="text-3xl font-bold text-gray-200">Choose Your Plan</h2>
                    <p className="text-gray-400">
                        Let's choose the package that is best for you and explore it happily and cheerfully.
                    </p>
                </div>

                <div className="w-full flex flex-wrap justify-center md:justify-around gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`w-250px h-300px md:w-[300px] md:h-[350px] rounded-lg p-4 gap-y-4 flex flex-col justify-between items-center border border-gray-200 bg-white transition-all duration-300 transform hover:-translate-y-2 hover:shadow-black`}>
                            
                        {/* <Image src={plan.image} alt={plan.title} width={80} height={80} /> */}
                        <h3 className="text-2xl font-bold mt-4">{plan.title}</h3>

                        <ul className="gap-y-4 text-gray-600 text-sm text-left w-full px-2">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center p-0.5 gap-2"><Check strokeWidth={1.5} color='#2FAB73' /> {feature}</li>
                            ))}
                        </ul>

                        <div className='flex flex-col items-center justify-center'>
                        <div className="text-xl font-bold p-2">
                            {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                            {plan.price !== 0 && (
                            <span className="text-sm text-gray-500"> / mo</span>
                            )}
                        </div>
                            
                        <Link href="#">
                            <button onClick={handleClick} className={`px-6 py-2 tracking-wide cursor-pointer rounded-full text-sm font-semibold transition 
                                ${activePlan === plan.title
                                ? 'bg-yellow-500 text-white'
                                : 'border border-yellow-500 text-yellow-500 hover:bg-yellow-100' }`}>
                                    Select
                            </button>            
                        </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}

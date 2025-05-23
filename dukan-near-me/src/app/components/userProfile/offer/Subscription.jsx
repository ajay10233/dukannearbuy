"use client"

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function Subscription() {
  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState("");
  const [subscriptionExpired, setSubscriptionExpired] = useState(false); // New state to track expiration
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/plans");
        const data = await res.json();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    const fetchUserPlan = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();

        // Set active plan name or default BASIC
        setActivePlan(data.subscriptionPlan?.name || "BASIC");

        // Check if subscription expired
        if (data.subscriptionPlan?.expiresAt) {
          const expiryDate = new Date(data.subscriptionPlan.expiresAt);
          const now = new Date();

          // expired if expiryDate is before now
          setSubscriptionExpired(expiryDate < now);
        } else {
          // If no subscription plan, consider expired or false
          setSubscriptionExpired(true);
        }
      } catch (error) {
        console.error("Error fetching user plan:", error);
      }
    };

    fetchPlans();
    fetchUserPlan();
  }, []);

  const handleClick = (planName, price) => {
    if (price === 0) return;
    setActivePlan(planName);
    router.push(`/payment?plan=${planName}&amount=${price}`);
    toast.success(`You have selected the ${planName} plan!`);
  };

  return (
    <div className="min-h-screen px-6 py-10 flex items-center justify-center" id="subscription">
        <div className="w-full max-w-[1200px] flex flex-col items-center gap-5 md:gap-10">
            <div className="text-center gap-y-2 p-4">
                <h2 className="text-3xl font-bold text-gray-200">Choose Your Plan</h2>
                <p className="text-gray-300">
                    Let's choose the package that is best for you and explore it happily and cheerfully.
                </p>
            </div>

            <div className="w-full flex flex-wrap justify-center md:justify-around gap-8">
                {plans.map((plan) => {
                    const isActive = activePlan === plan.name;
                    // Show "Select" instead of "Selected" if plan is active but expired
                    const buttonText = isActive && !subscriptionExpired ? "Selected" : "Select";
                    // Disable button only for free plans, but allow selection on expired active plans
                    const isDisabled = plan.price === 0 || (isActive && !subscriptionExpired);

                    return (
                    <div
                        key={plan.id}
                        className={`w-[260px] h-[330px] md:w-[300px] md:h-[350px] rounded-xl p-4 gap-y-4 flex flex-col justify-between items-center transition-all duration-300 transform
                        ${
                            isActive && !subscriptionExpired
                            ? "text-gray-600 shadow-xl shadow-yellow-500/50 ring-2 ring-offset-2 ring-orange-300 bg-gradient-to-tr from-yellow-200 via-orange-200 to-pink-200 animate-premium-pop"
                            : plan.name === "BASIC"
                            ? "bg-gradient-to-tr from-white to-gray-300 border-2 hover:shadow-md hover:scale-105 border-yellow-400 hover:ring-2 hover:ring-yellow-300"
                            : "bg-gradient-to-tr from-blue-50 via-blue-100 to-cyan-100 border-2 border-yellow-300 hover:scale-110 hover:rotate-[1deg] hover:text-gray-600 hover:shadow-xl hover:shadow-yellow-500/50 hover:ring-2 hover:ring-offset-2 hover:ring-orange-300 hover:bg-gradient-to-tr hover:from-yellow-200 hover:via-orange-200 hover:to-pink-200 animate-premium-pop"
                        }`}
                    >
                        {plan.image && (
                        <Image
                            src={plan.image}
                            alt={plan.name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                        )}

                        <h3 className="text-2xl font-bold mt-0 md:mt-4">{plan.name}</h3>

                        <ul className="gap-y-4 text-gray-600 text-sm text-left w-full px-2">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center p-0.5 gap-2">
                            <Check strokeWidth={1.5} color="#2FAB73" /> {feature}
                            </li>
                        ))}
                        </ul>

                        <div className="flex flex-col items-center justify-center">
                        <div className="text-xl font-bold p-2">
                            {plan.price === 0 ? "Free" : `₹${plan.price}`}
                            {plan.price !== 0 && <span className="text-sm text-gray-500"> / mo</span>}
                        </div>

                        <button
                            onClick={() => handleClick(plan.name, plan.price)}
                            disabled={isDisabled}
                            className={`px-6 py-2 tracking-wide cursor-pointer rounded-full text-sm font-semibold transition
                            ${
                                plan.name === "BASIC"
                                ? "border border-yellow-500 text-yellow-500 bg-yellow-100"
                                : "border border-yellow-500 text-yellow-500 bg-yellow-100"
                            }
                            ${isActive && !subscriptionExpired ? "ring-2 ring-yellow-300" : ""}
                            ${plan.price === 0 ? "cursor-not-allowed opacity-70" : ""}
                            `}
                        >
                            {buttonText}
                        </button>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
}

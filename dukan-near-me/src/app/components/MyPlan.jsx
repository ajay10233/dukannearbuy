import { useEffect, useState } from "react";
import { BadgeCheck, XCircle, Sparkles, ArrowRight } from "lucide-react";
import Head from "next/head";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LogoLoader from "./LogoLoader";

export default function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        const response = await fetch("/api/users/me");
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        console.log("User data from API:", data);

        const userPlans = [];

        // Include subscription plan if available
        if (data.subscriptionPlan) {
          const activatedAt = new Date(data.subscriptionPlan.createdAt);
          const expiresAt = new Date(data.subscriptionPlan.expiresAt);
          const isExpired = new Date() > expiresAt;

          userPlans.push({
            id: data.subscriptionPlan.id,
            name: data.subscriptionPlan.name,
            type: "subscription",
            status: isExpired ? "expired" : "active",
            date: `Activated on: ${activatedAt.toLocaleDateString()}\nValid till: ${expiresAt.toLocaleDateString()}`,
            description: `Plan: ${data.subscriptionPlan.name}, Price: ₹${data.subscriptionPlan.price}`,
          });
        }

        // Include paid promotions if available
        if (data.paidPromotions && data.paidPromotions.length > 0) {
          data.paidPromotions.forEach((promo) => {
            const promoStart = new Date(promo.createdAt);
            const promoEnd = new Date(promo.expiresAt);
            const isPromoExpired = new Date() > promoEnd;

            userPlans.push({
              id: promo.id,
              name: "Paid Promotion",
              type: "paid",
              status: isPromoExpired ? "expired" : "active",
              date: `Promotion started on: ${promoStart.toLocaleDateString()}\nValid till: ${promoEnd.toLocaleDateString()}`,
              description: `Amount Paid: ₹${promo.amountPaid}, Range: ${promo.range}` + (promo.notes ? `, Reason: ${promo.notes}` : ""),
              image: promo.image || null,
            });
          });
        }

        setPlans(userPlans);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlans();
  }, []);

  if (loading) {
    return <LogoLoader content={"Fetching your plans..."} />;
  }

  return (
    <>
      <Head>
        <title>My Plans</title>
      </Head>

      <section className="relative h-screen bg-gradient-to-br from-white via-indigo-50 to-white px-4 sm:px-10 lg:px-20 py-12">
        <div className="w-full max-w-7xl mx-auto relative">
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 py-6">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-indigo-600" />
              My Plans
            </h2>
          </div>

          {/* Scrollable Content */}
          <div className="max-h-[75vh] overflow-y-auto rounded-xl border border-gray-200 dialogScroll">
            <div className="grid grid-cols-1 divide-y divide-gray-100">
              {plans.length > 0 ? (
                plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-6 gap-4 transition-all duration-300 hover:bg-gray-50 ${
                      plan.status === "active"
                        ? "bg-green-50/40 border-l-4 border-green-500"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex flex-col gap-1 md:gap-2">
                      <h3 className="text-lg font-semibold text-gray-800">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                      <p className="text-xs text-gray-500 whitespace-pre-line">{plan.date}</p>
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
                        <button
                          onClick={() => {
                            const target = plan.type === "paid" ? "#promotion" : "#subscription";
                            router.push(`/partnerHome${target}`);
                          }}
                          className="inline-flex cursor-pointer items-center text-indigo-600 hover:text-indigo-800 transition font-semibold text-sm"
                        >
                          Renew <ArrowRight className="h-4 w-4 ml-1" />
                        </button>
                      )}
                    </div>

                    {plan.type === "paid" && plan.image && (
                      <div className="mt-2">
                        <Image
                          src={plan.image}
                          alt="Promotion Image"
                          width={150}
                          height={150}
                          className="rounded-md shadow-sm"
                        />
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="flex items-center justify-center py-10 text-gray-600">
                  No plans found.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-1 right-4 w-17 h-17 md:w-32 md:h-32">
          <Image
            src="/nearbuydukan - watermark.png"
            alt="Watermark"
            fill
            sizes="(max-width: 768px) 100px, (min-width: 769px) 150px"
            className="object-contain w-17 h-17 md:w-32 md:h-32"
            priority
          />
        </div>
      </section>
    </>
  );
}

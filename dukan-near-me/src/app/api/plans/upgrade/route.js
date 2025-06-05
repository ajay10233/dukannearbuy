import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import { addDays } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { couponId, planId } = await req.json();
  // if(!couponId || !planId) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  var coupon=null;
  if(couponId){
    coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
    });
    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon" }, { status: 400 });
    }

    coupon.limit -= 1;
    await prisma.coupon.update({ where: { id: couponId }, data: { limit: coupon.limit } });
  }


  const plan = await prisma.plan.findUnique({
    where: { id: planId },
  });

  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const originalPrice = plan.price;
  var finalPrice = originalPrice;
  if(coupon!=null){
    const discount = Math.round((originalPrice * coupon.discountPercentage) / 100);
    finalPrice = originalPrice - discount;
  }

  if (finalPrice <= 0) {
    // Directly upgrade user
    const planDurationInDays = plan.durationInDays || 30; 
    const now = new Date();

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        subscriptionPlanId: plan.id,
        planActivatedAt: now,
        planExpiresAt: addDays(now, planDurationInDays),
      },
    });

    return NextResponse.json({ upgraded: true });
  }

  // Otherwise: return price info to proceed with payment
  // return NextResponse.json({
  //   upgraded: false,
  //   finalPrice,
  //   planName: plan.name,
  //   planId: plan.id,
  //   couponId: coupon.id,
  // });


// 💳 Future Stripe Payment Flow
// const stripeSession = await stripe.checkout.sessions.create({
//   payment_method_types: ["card"],
//   line_items: [
//     {
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: "Premium Plan",
//         },
//         unit_amount: finalPrice * 100,
//       },
//       quantity: 1,
//     },
//   ],
//   mode: "payment",
//   success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
//   cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?canceled=true`,
//   metadata: {
//     userEmail: session.user.email,
//     couponId: coupon.id,
//   },
// });

// return NextResponse.json({ stripeUrl: stripeSession.url });

  return NextResponse.json({ error: "Some error occurred please contact support" }, { status: 501 });
}

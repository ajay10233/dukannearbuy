import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
// import { stripe } from "@/lib/stripe"; // Uncomment when using Stripe

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { couponId } = await req.json();

  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!coupon) {
    return Response.json({ error: "Invalid coupon" }, { status: 400 });
  }

  const originalPrice = 999;
  const discount = Math.round((originalPrice * coupon.discountPercentage) / 100);
  const finalPrice = originalPrice - discount;

  if (finalPrice <= 0) {
    // 100% OFF: Directly upgrade
    console.log("Upgrading the user to PREMIUM plan");
    // await prisma.user.update({
    //   where: { email: session.user.email },
    //   data: {
    //     plan: "PREMIUM",
    //     planActivatedAt: new Date(),
    //     couponUsedId: coupon.id,
    //   },
    // });

    return Response.json({ upgraded: true });
  }

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

  // return Response.json({ stripeUrl: stripeSession.url });

  return Response.json({ error: "Non-zero price but Stripe not configured" }, { status: 501 });
}

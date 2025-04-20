import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscriptionPlan: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const sessionToken = session?.user?.email; // You can change this if using JWT or other token

  return NextResponse.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    phone: user.phone,
    role: user.role,
    profilePhoto: user.profilePhoto,
    age: user.age,
    gender: user.gender,
    address: {
      houseNumber: user.houseNumber,
      street: user.street,
      buildingName: user.buildingName,
      landmark: user.landmark,
      city: user.city,
      state: user.state,
      country: user.country,
      zipCode: user.zipCode,
    },
    mobileNumber: user.mobileNumber,
    firmName: user.firmName,
    shopAddress: user.shopAddress,
    contactEmail: user.contactEmail,
    paymentDetails: user.paymentDetails,
    description: user.description,
    hashtags: user.hashtags,
    photos: user.photos,
    shopOpenTime: user.shopOpenTime,
    shopCloseTime: user.shopCloseTime,
    shopOpenDays: user.shopOpenDays,
    latitude: user.latitude,
    longitude: user.longitude,
    allowedRoutes:
      user.role === "ADMIN"
        ? ["/", "/dashboard", "/admin"]
        : ["/", "/dashboard"],
    sessionToken,
    subscriptionPlan: user.subscriptionPlan
      ? {
          id: user.subscriptionPlan.id,
          name: user.subscriptionPlan.name,
          price: user.subscriptionPlan.price,
          durationInDays: user.subscriptionPlan.durationInDays,
          features: user.subscriptionPlan.features,
          maxUploadSizeMB: user.subscriptionPlan.maxUploadSizeMB,
        }
      : null,
  });
}

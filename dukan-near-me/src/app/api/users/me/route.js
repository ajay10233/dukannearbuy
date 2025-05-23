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
      pastAddresses: true,
      paidProfilesGiven: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const address = {
    houseNumber: user.houseNumber,
    street: user.street,
    buildingName: user.buildingName,
    landmark: user.landmark,
    city: user.city,
    state: user.state,
    country: user.country,
    zipCode: user.zipCode,
  };

  // Common data for all roles
  let data = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
    phone: user.phone,
    role: user.role,
    profilePhoto: user.profilePhoto,
    photos: user.photos,
    address,
    mobileNumber: user.mobileNumber,
    firmName: user.firmName,
    shopAddress: user.shopAddress,
    contactEmail: user.contactEmail,
    paymentDetails: user.paymentDetails,
    description: user.description,
    hashtags: user.hashtags,
    shopOpenTime: user.shopOpenTime,
    shopCloseTime: user.shopCloseTime,
    shopOpenDays: user.shopOpenDays,
    latitude: user.latitude,
    longitude: user.longitude,
    createdAt: user.createdAt,
    upi_id: user.upi_id,
    scanner_image: user.scanner_image,
    allowedRoutes: user.role === "ADMIN" ? ["/", "/dashboard", "/admin"] : ["/", "/dashboard"],
    subscriptionPlan: user.subscriptionPlan
      ? {
          id: user.subscriptionPlan.id,
          name: user.subscriptionPlan.name,
          price: user.subscriptionPlan.price,
          durationInDays: user.subscriptionPlan.durationInDays,
          features: user.subscriptionPlan.features,
          maxUploadSizeMB: user.subscriptionPlan.maxUploadSizeMB,
          expiresAt: user.subscriptionPlan.expiresAt,
          createdAt: user.subscriptionPlan.createdAt,
        }
      : null,
    pastAddresses: user.pastAddresses.map((address) => ({
      id: address.id,
      houseNumber: address.houseNumber,
      street: address.street,
      buildingName: address.buildingName,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      latitude: address.latitude,
      longitude: address.longitude,
      movedOutAt: address.movedOutAt,
      createdAt: address.createdAt,
    })),
    paidPromotions: user.paidProfilesGiven.map((promo) => ({
      id: promo.id,
      amountPaid: promo.amountPaid,
      createdAt: promo.createdAt,
      expiresAt: promo.expiresAt,
      notes: promo.notes,
      image: promo.image,
      range: promo.range,
    })),
  };

  // Override if role is USER
  if (user?.role === "USER") {
    data = {
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
      address,
      mobileNumber: user.mobileNumber,
      description: user.description,
      latitude: user.latitude,
      longitude: user.longitude,
      createdAt: user.createdAt,
      allowedRoutes: user.role === "ADMIN" ? ["/", "/dashboard", "/admin"] : ["/", "/dashboard"],
      paidPromotions: user.paidProfilesGiven.map((promo) => ({
        id: promo.id,
        amountPaid: promo.amountPaid,
        createdAt: promo.createdAt,
        expiresAt: promo.expiresAt,
        notes: promo.notes,
        image: promo.image,
        range: promo.range,
      })),
    };
  }

  return NextResponse.json(data, { status: 200 });
}

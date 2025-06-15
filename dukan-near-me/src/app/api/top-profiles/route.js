import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/utils/db';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userLat = parseFloat(searchParams.get('latitude') || '0');
  const userLng = parseFloat(searchParams.get('longitude') || '0');
  const radiusKm = parseFloat(searchParams.get('radius') || '10');

  if (!userLat || !userLng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  // Step 1: Get distinct paid user IDs from PaidProfile with notes
  const paidProfiles = await prisma.paidProfile.findMany({
    select: { userId: true, notes: true, range: true },
    distinct: ['userId']
  });

  const paidUserMetaMap = new Map(
    paidProfiles.map(p => [p.userId, { notes: p.notes, range: p.range }])
  );


  const paidUserIds = paidProfiles.map(p => p.userId);

  // Step 2: Get paid users
  const paidUsers = await prisma.user.findMany({
    where: {
      id: { in: paidUserIds },
      role: { in: ['INSTITUTION', 'SHOP_OWNER'] },
      latitude: { not: null },
      longitude: { not: null },
    },
      select: {
    id: true,
    firmName: true,
    city: true,
    state: true,
    zipCode: true,
    country: true,
    shopAddress: true,
    username: true,
    hashtags: true,
    profilePhoto: true,
    latitude: true,
    longitude: true,
    role: true,
    // if you need subscription info
    subscriptionPlan: {
      select: {
        id: true,
        name: true,
        price: true,
        durationInDays: true,
        features: true,
        image: true,
      }
    },
    planActivatedAt: true,
    planExpiresAt: true,
    // *no* `password` field in here!
  },
  });

  // Step 3: Get free users
  const freeUsersRaw = await prisma.user.findMany({
    where: {
      id: { notIn: paidUserIds },
      role: { in: ['INSTITUTION', 'SHOP_OWNER'] },
      latitude: { not: null },
      longitude: { not: null },
    },
  });
  const freeUserIds = freeUsersRaw.map(u => u.id);

  // Step 4: Fetch rating data for all users (paid + free)
  const ratingData = await prisma.review.groupBy({
    by: ['institutionId'],
    where: {
      institutionId: { in: [...paidUserIds, ...freeUserIds] },
    },
    _avg: { rating: true },
    _count: { rating: true },
  });

  const ratingMap = new Map(
    ratingData.map(r => [r.institutionId, {
      averageRating: r._avg.rating,
      reviewCount: r._count.rating,
    }])
  );

  // Step 5: Enrich paid users with distance, rating, and notes
  const enrichedPaid = paidUsers
    .map(user => {
      const distance = calculateDistance(userLat, userLng, user.latitude, user.longitude);
      const ratingInfo = ratingMap.get(user.id) || {
        averageRating: 0,
        reviewCount: 0,
      };
      const meta = paidUserMetaMap.get(user.id) || {};
      const notes = meta.notes || null;
      const customRange = meta.range ?? radiusKm;

      return {
        user,
        distance,
        averageRating: ratingInfo.averageRating,
        reviewCount: ratingInfo.reviewCount,
        isPaid: true,
        notes,
        customRange,
      };
    })
    .filter(p => p.distance <= p.customRange && p.averageRating >= 4 && p.averageRating <= 5)
    .sort((a, b) => a.distance - b.distance);



  // Step 6: Enrich free users if needed
  let enrichedFree = [];
  if (enrichedPaid.length < 10) {
    enrichedFree = freeUsersRaw
      .map(user => {
        const distance = calculateDistance(userLat, userLng, user.latitude, user.longitude);
        const ratingInfo = ratingMap.get(user.id) || {
          averageRating: 0,
          reviewCount: 0,
        };

        return {
          user,
          distance,
          averageRating: ratingInfo.averageRating,
          reviewCount: ratingInfo.reviewCount,
          isPaid: false,
        };
      })
      .filter(p => p.distance <= radiusKm && p.averageRating >= 4 && p.averageRating <= 5)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10 - enrichedPaid.length);
  }


  const finalResult = [...enrichedPaid, ...enrichedFree].slice(0, 10);
  return NextResponse.json(finalResult, { status: 200 });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/utils/db';

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const userLat = parseFloat(searchParams.get('latitude') || '0');
  const userLng = parseFloat(searchParams.get('longitude') || '0');
  const radiusKm = parseFloat(searchParams.get('radius') || '5'); 

  if (!userLat || !userLng) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  // Fetch all valid paid profiles
  const paidProfiles = await prisma.paidProfile.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      user: {
        latitude: { not: null },
        longitude: { not: null },
      },
    },
    include: {
      user: true,
    },
  });

  const institutionIds = paidProfiles.map(p => p.user.id);

  // Get average ratings per institution
  const ratingData = await prisma.review.groupBy({
    by: ['institutionId'],
    where: {
      institutionId: { in: institutionIds },
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  const ratingMap = new Map(
    ratingData.map(r => [r.institutionId, {
      averageRating: r._avg.rating,
      reviewCount: r._count.rating,
    }])
  );

  // Enrich profiles with distance and rating
  const enrichedProfiles = paidProfiles
    .map(profile => {
      const distance = calculateDistance(
        userLat,
        userLng,
        profile.user.latitude,
        profile.user.longitude
      );

      const ratingInfo = ratingMap.get(profile.user.id) || {
        averageRating: 0,
        reviewCount: 0,
      };

      return {
        ...profile,
        distance,
        averageRating: ratingInfo.averageRating,
        reviewCount: ratingInfo.reviewCount,
      };
    })
    .filter(p => {
      const maxAllowedDistance = Math.min(radiusKm, p.range || radiusKm);
      return p.distance <= maxAllowedDistance;
    })
    .sort((a, b) => {
      // Sort by averageRating descending, then by distance ascending
      if ((b.averageRating || 0) !== (a.averageRating || 0)) {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }
      return a.distance - b.distance;
    })
    .slice(0, 10); // Limit to 10 results

  return NextResponse.json(enrichedProfiles, { status: 200 });
}

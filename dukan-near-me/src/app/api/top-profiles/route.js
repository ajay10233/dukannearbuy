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

  // Fetch all paid profiles with valid coordinates
  const paidProfiles = await prisma.paidProfile.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      user: {
        latitude: {
          not: null,
        },
        longitude: {
          not: null,
        },
      },
    },
    include: {
      user: true,
    },
  });

  // Filter by distance
  const nearbyProfiles = paidProfiles
    .map(profile => {
      const distance = calculateDistance(
        userLat,
        userLng,
        profile.user.latitude,
        profile.user.longitude
      );
      return {
        ...profile,
        distance,
      };
    })
    .filter(p => {
      const maxAllowedDistance = Math.min(radiusKm, p.range || radiusKm);
      return p.distance <= maxAllowedDistance;
    })    
    .sort((a, b) => a.distance - b.distance) // Optional: sort by closeness
    .slice(0, 10); // Limit to 10 results

  return NextResponse.json(nearbyProfiles, { status: 200 });
}

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/utils/db';

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

  const topProfiles = await prisma.$queryRawUnsafe(`
    SELECT 
      id,
      firstName,
      lastName,
      profilePhoto,
      firmName,
      shopAddress,
      contactEmail,
      description,
      hashtags,
      photos,
      shopOpenTime,
      shopCloseTime,
      shopOpenDays,
      latitude,
      longitude,
      houseNumber,
      street,
      buildingName,
      landmark,
      city,
      state,
      country,
      zipCode,
      (
        6371 * acos(
          cos(radians(${userLat})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(${userLng})) +
          sin(radians(${userLat})) * sin(radians(latitude))
        )
      ) AS distance
    FROM User
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    HAVING distance <= ${radiusKm}
    ORDER BY followers DESC
    LIMIT 10;
  `);

  return NextResponse.json(topProfiles, { status: 200 });
}

import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db'; // Adjust if your Prisma import path differs
import { differenceInDays, startOfDay, endOfDay, subDays } from 'date-fns';

const getGeoFilter = (lat, lng, radiusInKm = 5) => {
  const earthRadius = 6371; // in km
  const radiusInRad = radiusInKm / earthRadius;

  return {
    latitude: {
      gte: lat - radiusInRad,
      lte: lat + radiusInRad,
    },
    longitude: {
      gte: lng - radiusInRad,
      lte: lng + radiusInRad,
    },
  };
};

async function fetchReviewsInDateRange(date, lat, lng) {
  const start = startOfDay(date);
  const end = endOfDay(date);

  const geoFilter = getGeoFilter(lat, lng);

  return prisma.review.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end,
      },
      institution: {
        latitude: geoFilter.latitude,
        longitude: geoFilter.longitude,
      },
    },
    include: {
      institution: true,
      user: true,
    },
    orderBy: {
      rating: 'desc',
    },
    take: 10,
  });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat'));
  const lng = parseFloat(searchParams.get('lng'));
  try {
    if (!lat || !lng) {
      return NextResponse.json({ error: 'Missing lat or lng query parameters' }, { status: 400 });
    }
  
    const today = new Date();
    let reviews = await fetchReviewsInDateRange(today, lat, lng);
  
    if (reviews.length === 0) {
      const yesterday = subDays(today, 1);
      reviews = await fetchReviewsInDateRange(yesterday, lat, lng);
    }
  
    if (reviews.length === 0) {
      // Try without date filter but within 5km
      const geoFilter = getGeoFilter(lat, lng);
      reviews = await prisma.review.findMany({
        where: {
          institution: {
            latitude: geoFilter.latitude,
            longitude: geoFilter.longitude,
          },
        },
        include: {
          institution: true,
          user: true,
        },
        orderBy: {
          rating: 'desc',
        },
        take: 10,
      });
    }
  
    if (reviews.length === 0) {
      // Last fallback: just top 10 reviews anywhere
      reviews = await prisma.review.findMany({
        include: {
          institution: true,
          user: true,
        },
        orderBy: {
          rating: 'desc',
        },
        take: 10,
      });
    }
  
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  
}

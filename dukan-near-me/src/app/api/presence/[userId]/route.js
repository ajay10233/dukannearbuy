import { NextResponse } from "next/server";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

export async function GET(_, { params }) {
  const status = await redis.get(`user:${params.userId}:status`);
  return NextResponse.json({ userId: params.userId, status: status || "offline" });
}

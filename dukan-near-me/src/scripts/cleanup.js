// scripts/cleanup.js

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function cleanupExpired() {
  const now = new Date();

  // Clean Token
  await prisma.token.deleteMany({
    where: { expiresAt: { lt: now } },
  });

  // Add similar deletes for other models...

  console.log('Cleanup complete');
  await prisma.$disconnect();
}

cleanupExpired().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

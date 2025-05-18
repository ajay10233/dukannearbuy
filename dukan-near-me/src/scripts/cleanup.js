const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const prisma = new PrismaClient();

async function cleanupExpired() {
  const now = new Date();
  const timestamp = now.toISOString();

  console.log(`🧹 Cleanup started at ${timestamp}`);

  try {
    const deletedTokens = await prisma.token.deleteMany({
      where: { expiresAt: { lt: now } },
    });

    console.log(`✅ Deleted ${deletedTokens.count} expired tokens at ${timestamp}`);
    
    // You can add more models here, e.g.
    // const deletedSessions = await prisma.session.deleteMany({ ... });
    // console.log(`✅ Deleted ${deletedSessions.count} expired sessions at ${timestamp}`);

    console.log('✅ Cleanup complete');
  } catch (error) {
    console.error(`❌ Cleanup failed at ${timestamp}:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupExpired().catch(async (e) => {
  console.error('❌ Unhandled cleanup error:', e);
  await prisma.$disconnect();
  process.exit(1);
});

const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');

dotenv.config();

const prisma = new PrismaClient();

async function cleanupExpired() {
  const now = new Date();
  const timestamp = now.toISOString();
  console.log(`🧹 Cleanup started at ${timestamp}`);

  try {
    // Delete expired tokens
    const deletedTokens = await prisma.token.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedTokens.count} expired tokens`);

    // Delete expired password reset tokens
    const deletedResetTokens = await prisma.passwordResetToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedResetTokens.count} expired password reset tokens`);

    // Delete expired messages
    const deletedMessages = await prisma.message.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedMessages.count} expired messages`);

    // Delete expired shortbills
    const deletedshortBill = await prisma.shortBill.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedshortBill.count} expired messages`);

    // Delete expired coupons
    const deletedcoupons = await prisma.coupon.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedcoupons.count} expired messages`);

    // Delete expired paidprofiles
    const deletedpaidProfiles = await prisma.paidProfile.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedpaidProfiles.count} expired messages`);

    // Delete expired bills
    const deletedBills = await prisma.bill.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedBills.count} expired bills`);

    // Delete expired verificationTokens
    const deletedverificationTokens = await prisma.verificationToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedverificationTokens.count} expired bills`);

    // Downgrade users with expired plans
    const expiredUsers = await prisma.user.findMany({
      where: {
        planExpiresAt: { lt: now },
        subscriptionPlan: { not: null },
      },
    });

    for (const user of expiredUsers) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionPlanId: null,
          planActivatedAt: null,
          planExpiresAt: null,
        },
      });
    }

    console.log(`✅ Downgraded ${expiredUsers.length} users with expired plans`);
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

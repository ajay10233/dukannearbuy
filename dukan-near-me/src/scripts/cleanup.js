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

    // 🛑 Messages: Only delete if the related conversation is accepted
    const expiredMessages = await prisma.message.findMany({
      where: {
        expiresAt: { lt: now },
        conversation: { is: {} },  // <-- relation exists
      },
      select: {
        id: true,
        conversation: {
          select: {
            accepted: true,
          },
        },
      },
    });



    let deletedMessageCount = 0;
    for (const message of expiredMessages) {
      if (message.conversation?.accepted) {
        await prisma.message.delete({ where: { id: message.id } });
        deletedMessageCount++;
      }
    }
    console.log(`✅ Deleted ${deletedMessageCount} expired messages from accepted conversations`);

    // Delete expired shortbills
    const deletedshortBill = await prisma.shortBill.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedshortBill.count} expired short bills`);

    // Delete expired coupons
    const deletedcoupons = await prisma.coupon.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedcoupons.count} expired coupons`);

    // Delete expired paid profiles
    const deletedpaidProfiles = await prisma.paidProfile.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedpaidProfiles.count} expired paid profiles`);

    // Delete expired bills
    const deletedBills = await prisma.bill.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedBills.count} expired bills`);

    // Delete expired verification tokens
    const deletedverificationTokens = await prisma.verificationToken.deleteMany({
      where: { expiresAt: { lt: now } },
    });
    console.log(`✅ Deleted ${deletedverificationTokens.count} expired verification tokens`);

    // ✅ Delete expired reviews only if more than 10 exist
    const totalReviewCount = await prisma.review.count();
    if (totalReviewCount > 10) {
      const expiredReviews = await prisma.review.findMany({
        where: { expiresAt: { lt: now } },
        orderBy: { createdAt: 'asc' }, // delete oldest first
      });

      for (const review of expiredReviews) {
        await prisma.review.delete({ where: { id: review.id } });
      }
      console.log(`✅ Deleted ${expiredReviews.length} expired reviews (kept minimum of 10)`);
    } else {
      console.log(`⏭️ Skipped expired review deletion (only ${totalReviewCount} total reviews)`);
    }

    // // ✅ Delete expired conversations only if accepted OR expired 7+ days ago
    // const expiredConversations = await prisma.conversation.findMany({
    //   where: {
    //     expiresAt: { lt: now },
    //     accepted: true,
    //   },
    // });

    // let deletedConversationCount = 0;
    // for (const convo of expiredConversations) {
    //   const createdAt = new Date(convo.createdAt);
    //   const isOlderThan7Days = (now - createdAt) > (7 * 24 * 60 * 60 * 1000);

    //   if (convo.accepted || isOlderThan7Days) {
    //     await prisma.conversation.delete({ where: { id: convo.id } });
    //     deletedConversationCount++;
    //   }
    // }

    // console.log(`✅ Deleted ${deletedConversationCount} expired conversations (respecting acceptance & 7-day delay)`);

    // ✅ Downgrade users with expired plans
    const expiredUsers = await prisma.user.findMany({
      where: {
        planExpiresAt: { lt: now },
        subscriptionPlan: {
          isNot: null,
        },
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

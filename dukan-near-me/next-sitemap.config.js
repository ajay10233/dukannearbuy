/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://nearbuydukaan.com',
  generateRobotsTxt: true,
  exclude: [
    '/login',
    '/dashboard',
    '/dashboard/*',
    '/partnerHome',
    '/userProfile',
    '/userProfile/*',
    '/admin',
    '/admin/*',
    '/session-manager',
    '/otp-verify',
    '/reset-password',
    '/forgot-password',
    '/edit-format',
    '/favprofile',
    '/institution-edit-profile',
    '/mytoken',
    '/notification',
    '/qr-code',
    '/scanqr',
    '/scan-qr',
    '/shortbill',
    '/chat',
    '/tokengenerate',
    '/token',
    '/payments/create',
    '/payments/history',
    '/promotion-payment',
    '/partnerProfile',
    '/myplan',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
    // Optional: remove `additionalSitemaps` unless you're manually generating and hosting others.
    additionalSitemaps: [
      // Only include this if you truly have a separate pre-built sitemap
      // 'https://nearbuydukaan.com/sitemap-0.xml',
    ],
  },
};

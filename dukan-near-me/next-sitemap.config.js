/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://nearbuydukaan.com',
  generateRobotsTxt: true,
  exclude: [
    '/login',
    '/dashboard/*',
    '/partnerHome',
    '/userProfile/*',
    '/admin/*',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
    ],
    additionalSitemaps: [
      'https://nearbuydukaan.com/sitemap-0.xml',
    ],
  },
};

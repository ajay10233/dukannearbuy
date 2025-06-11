/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://nearbuydukan.com',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/admin/*', '/api/*'],
};

import { SitemapStream, streamToPromise } from 'sitemap'
import { Readable } from 'stream'

export async function GET(req) {
  const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    { url: '/shop', changefreq: 'daily', priority: 0.9 },
    // Add dynamic links if any from your DB
  ]

  const stream = new SitemapStream({ hostname: 'https://nearbuydukan.com' })
  const xmlData = await streamToPromise(Readable.from(links).pipe(stream)).then(data => data.toString())

  return new Response(xmlData, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Just in case there are private routes later
    },
    sitemap: 'https://linkharbor.everydaycodings.com/sitemap.xml',
  }
}

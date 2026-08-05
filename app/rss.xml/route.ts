import { getAllContents, TYPE_MAP } from '@/data/contents'

const SITE_URL = 'https://hudyat.com'
const SITE_TITLE = 'Hudyat — New Era University Student Publication'
const SITE_DESC = 'The official student publication of New Era University.'

export async function GET() {
  const articles = await getAllContents(50)

  const items = articles.map((a) => {
    const category = TYPE_MAP[a.type_id] || 'Uncategorized'
    const pubDate = a.date ? new Date(a.date).toUTCString() : new Date().toUTCString()
    const link = `${SITE_URL}/article/${a.slug}`

    return `
    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${a.excerpt || a.title}]]></description>
      <author>${a.author}</author>
      <category>${category}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`
  }).join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESC}</description>
    <language>en-ph</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

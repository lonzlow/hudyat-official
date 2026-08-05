import { NextRequest } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { contentId } = await req.json()
    const id = typeof contentId === 'string' ? parseInt(contentId, 10) : contentId

    if (!id || isNaN(id)) {
      return Response.json({ error: 'Invalid contentId' }, { status: 400 })
    }

    const supabase = createServerClient()
    await supabase.from('article_views').insert({ content_id: id })

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to track view' }, { status: 500 })
  }
}

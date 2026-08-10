import { NextRequest } from 'next/server'
import { recordView } from '@/data/views'

export async function POST(req: NextRequest) {
  try {
    const { contentId } = await req.json()
    const id = typeof contentId === 'string' ? parseInt(contentId, 10) : contentId
    if (!id || isNaN(id)) {
      return Response.json({ error: 'Invalid contentId' }, { status: 400 })
    }

    await recordView(id)

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to track view' }, { status: 500 })
  }
}

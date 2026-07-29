import 'server-only'
import { createServerClient } from '@/lib/supabase/server'
import { extractYouTubeId } from '@/lib/youtube'

export interface NormalizedVideo {
  id: string
  youtubeId: string | null
  title: string
}

export async function getVideos(): Promise<NormalizedVideo[]> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from('videos')
    .select('*')
    .order('video_id', { ascending: false })

  return (data || []).map((v) => ({
    id: v.video_id.toString(),
    youtubeId: extractYouTubeId(v.video_link || ''),
    title: v.video_name || '',
  }))
}

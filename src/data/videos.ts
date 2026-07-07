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
    .order('videoId', { ascending: false })

  return (data || []).map((v) => ({
    id: v.videoId.toString(),
    youtubeId: extractYouTubeId(v.videoLink || ''),
    title: v.videoName || '',
  }))
}

import 'server-only'
import type { createSessionClient } from './server'

// Must match the bucket named in supabase/storage-policies.sql.
const BUCKET = process.env.IMAGE_BUCKET ?? 'images'
const MAX_BYTES = 5 * 1024 * 1024

type SessionClient = Awaited<ReturnType<typeof createSessionClient>>
type Result = { ok: true; url: string } | { ok: false; error: string }

// Decide the type from the file's own bytes: the browser-supplied MIME type can be anything.
function sniff(b: Uint8Array): { ext: string; type: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: 'jpg', type: 'image/jpeg' }
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { ext: 'png', type: 'image/png' }
  const riff = String.fromCharCode(...b.slice(0, 4)) === 'RIFF'
  if (riff && String.fromCharCode(...b.slice(8, 12)) === 'WEBP') return { ext: 'webp', type: 'image/webp' }
  return null
}

export async function uploadImage(
  supabase: SessionClient,
  file: File,
  prefix: 'articles' | 'authors'
): Promise<Result> {
  if (file.size === 0) return { ok: false, error: 'Choose an image first.' }
  if (file.size > MAX_BYTES) return { ok: false, error: 'The image must be 5 MB or smaller.' }

  const bytes = new Uint8Array(await file.arrayBuffer())
  const kind = sniff(bytes)
  if (!kind) return { ok: false, error: 'Use a JPG, PNG or WebP image.' }

  const path = `${prefix}/${crypto.randomUUID()}.${kind.ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(path, bytes, { contentType: kind.type })
  if (error) return { ok: false, error: 'Upload failed. Check the storage policies and bucket name.' }

  return { ok: true, url: supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl }
}

import { supabase } from '@/lib/supabaseClient'
import type { ModerationStatus, UploadRow } from '@/lib/types'

const BUCKET = 'event-media'
const SIGNED_URL_TTL_SECONDS = 300

export async function fetchReadyUploads(eventId: string): Promise<UploadRow[]> {
  const { data, error } = await supabase
    .from('uploads')
    .select(
      'id, event_id, guest_name, file_path, file_type, mime_type, verified_file_size, moderation_status, created_at',
    )
    .eq('event_id', eventId)
    .eq('status', 'ready')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function setUploadModerationStatus(
  uploadId: string,
  status: Extract<ModerationStatus, 'approved' | 'rejected'>,
): Promise<void> {
  const { error } = await supabase.rpc('set_upload_moderation_status', {
    p_upload_id: uploadId,
    p_status: status,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function createSignedUrlMap(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {}

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS)

  if (error) {
    throw new Error(error.message)
  }

  const map: Record<string, string> = {}
  for (const item of data) {
    if (item.path && item.signedUrl) {
      map[item.path] = item.signedUrl
    }
  }
  return map
}

export async function createSignedDownloadUrl(path: string, fileName: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS, { download: fileName })

  if (error || !data) {
    throw new Error('İndirme bağlantısı oluşturulamadı')
  }

  return data.signedUrl
}

export async function downloadEventZip(eventId: string, eventName: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession()
  const accessToken = sessionData.session?.access_token
  if (!accessToken) {
    throw new Error('Oturum bulunamadı, lütfen tekrar giriş yapın')
  }

  const functionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-event-zip`
  const response = await fetch(`${functionsUrl}?eventId=${encodeURIComponent(eventId)}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!response.ok) {
    throw new Error('Zip dosyası oluşturulamadı')
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${eventName.replace(/[^\p{L}\p{N}_-]/gu, '_')}.zip`
  link.click()
  URL.revokeObjectURL(url)
}

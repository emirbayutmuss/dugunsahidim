import { supabase } from '@/lib/supabaseClient'
import { generateGalleryDownloadToken } from '@/lib/slug'
import type { ModerationStatus, UploadRow } from '@/lib/types'

const BUCKET = 'event-media'
const SIGNED_URL_TTL_SECONDS = 300
const RATE_LIMITED_PATTERN = /^rate_limited:(\d+)$/

export class GalleryDownloadRateLimitedError extends Error {
  retryAfterMs: number

  constructor(retryAfterSeconds: number) {
    const minutes = Math.ceil(retryAfterSeconds / 60)
    super(`Az önce bir bağlantı gönderildi, ${minutes} dakika sonra tekrar deneyin`)
    this.retryAfterMs = retryAfterSeconds * 1000
  }
}

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

export async function sendGalleryDownloadEmail(eventId: string): Promise<void> {
  const { data: userData, error: userError } = await supabase.auth.getUser()
  const email = userData.user?.email
  if (userError || !email) {
    throw new Error('Oturum bulunamadı, lütfen tekrar giriş yapın')
  }

  const token = generateGalleryDownloadToken()

  const { error: rpcError } = await supabase.rpc('request_gallery_download_link', {
    p_event_id: eventId,
    p_token: token,
  })

  if (rpcError) {
    const match = RATE_LIMITED_PATTERN.exec(rpcError.message)
    if (match) {
      throw new GalleryDownloadRateLimitedError(Number(match[1]))
    }
    throw new Error('İndirme linki oluşturulamadı')
  }

  // Aynı e-posta altyapısını kullanıyoruz: mevcut login akışının kullandığı
  // Supabase magic-link mekanizması. redirectTo, bizim kendi token'ımızı taşıyan
  // indirme sayfamıza işaret ediyor — asıl yetkilendirme bu token'dan geliyor,
  // Supabase'in oturum açması yalnızca bir yan fayda.
  const { error: otpError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/indir/${token}`,
    },
  })

  if (otpError) {
    throw new Error('E-posta gönderilemedi, lütfen tekrar deneyin')
  }
}

function parseFileNameFromContentDisposition(header: string | null): string {
  const match = header ? /filename="?([^"]+)"?/.exec(header) : null
  return match?.[1] ?? 'galeri.zip'
}

export async function downloadGalleryZipByToken(token: string): Promise<void> {
  const functionsUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/download-event-zip`
  const response = await fetch(`${functionsUrl}?token=${encodeURIComponent(token)}`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
    cache: 'no-store',
  })

  if (!response.ok) {
    if (response.status === 410) {
      throw new Error('Bu bağlantının süresi dolmuş veya geçersiz')
    }
    throw new Error('Zip dosyası oluşturulamadı')
  }

  const fileName = parseFileNameFromContentDisposition(response.headers.get('content-disposition'))
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

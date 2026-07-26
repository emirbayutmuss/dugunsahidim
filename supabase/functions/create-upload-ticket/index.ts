import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { ALLOWED_MIME_TYPES } from '../_shared/media.ts'

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }
const BUCKET = 'event-media'
const SLUG_PATTERN = /^[a-z0-9_-]{8,32}$/
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const GUEST_NAME_MAX_LENGTH = 80
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000
const RATE_LIMIT_MAX_PER_WINDOW = 15
const ACTIVE_UPLOAD_STATUSES = ['pending', 'processing', 'ready']

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const IP_HASH_SECRET = Deno.env.get('IP_HASH_SECRET')!

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), { status, headers: jsonHeaders })
}

async function hashIp(ip: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(IP_HASH_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(ip))
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('cf-connecting-ip') ?? 'unknown'
}

interface TicketRequestBody {
  slug?: unknown
  guestName?: unknown
  mimeType?: unknown
  declaredSize?: unknown
  visitorId?: unknown
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let body: TicketRequestBody
  try {
    body = await req.json()
  } catch {
    return jsonError('Geçersiz istek', 400)
  }

  const { slug, guestName, mimeType, declaredSize, visitorId } = body

  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
    return jsonError('Etkinlik bulunamadı', 404)
  }
  if (typeof mimeType !== 'string' || !(mimeType in ALLOWED_MIME_TYPES)) {
    return jsonError('Desteklenmeyen dosya türü', 400)
  }
  if (typeof declaredSize !== 'number' || !Number.isFinite(declaredSize) || declaredSize <= 0) {
    return jsonError('Geçersiz dosya boyutu', 400)
  }
  if (guestName !== undefined && guestName !== null && typeof guestName !== 'string') {
    return jsonError('Geçersiz istek', 400)
  }

  const trimmedGuestName =
    typeof guestName === 'string' && guestName.trim().length > 0
      ? guestName.trim().slice(0, GUEST_NAME_MAX_LENGTH)
      : null

  const mediaConfig = ALLOWED_MIME_TYPES[mimeType]
  if (declaredSize > mediaConfig.maxBytes) {
    return jsonError('Dosya çok büyük', 400)
  }

  const { data: event, error: eventError } = await supabaseAdmin
    .from('events')
    .select('id, status, max_uploads, max_storage_bytes')
    .eq('slug', slug)
    .maybeSingle()

  if (eventError || !event) {
    return jsonError('Etkinlik bulunamadı', 404)
  }
  if (event.status !== 'active') {
    return jsonError('Bu etkinlik şu anda yükleme kabul etmiyor', 403)
  }

  const clientIp = getClientIp(req)
  const ipHash = await hashIp(clientIp)
  const windowStart = new Date(
    Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS,
  ).toISOString()

  const { data: rateLimitCount, error: rateLimitError } = await supabaseAdmin.rpc(
    'increment_rate_limit',
    { p_event_id: event.id, p_ip_hash: ipHash, p_window_start: windowStart },
  )

  if (rateLimitError) {
    return jsonError('Sunucu hatası, lütfen tekrar deneyin', 500)
  }
  if (rateLimitCount > RATE_LIMIT_MAX_PER_WINDOW) {
    return jsonError('Çok fazla deneme yaptınız, lütfen birkaç dakika sonra tekrar deneyin', 429)
  }

  const { data: existingUploads, error: existingError } = await supabaseAdmin
    .from('uploads')
    .select('verified_file_size, declared_file_size')
    .eq('event_id', event.id)
    .in('status', ACTIVE_UPLOAD_STATUSES)

  if (existingError) {
    return jsonError('Sunucu hatası, lütfen tekrar deneyin', 500)
  }

  if (existingUploads.length >= event.max_uploads) {
    return jsonError('Bu etkinlik yükleme limitine ulaştı', 403)
  }

  const usedBytes = existingUploads.reduce(
    (sum, row) => sum + (row.verified_file_size ?? row.declared_file_size ?? 0),
    0,
  )
  if (usedBytes + declaredSize > event.max_storage_bytes) {
    return jsonError('Bu etkinlik depolama limitine ulaştı', 403)
  }

  const uploadId = crypto.randomUUID()
  const path = `${event.id}/${uploadId}.${mediaConfig.extension}`
  const validVisitorId =
    typeof visitorId === 'string' && UUID_PATTERN.test(visitorId) ? visitorId : null

  const { error: insertError } = await supabaseAdmin.from('uploads').insert({
    id: uploadId,
    event_id: event.id,
    guest_name: trimmedGuestName,
    file_path: path,
    file_type: mediaConfig.family,
    mime_type: mimeType,
    declared_file_size: declaredSize,
    status: 'pending',
    visitor_id: validVisitorId,
  })

  if (insertError) {
    return jsonError('Sunucu hatası, lütfen tekrar deneyin', 500)
  }

  const { data: signed, error: signError } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUploadUrl(path)

  if (signError || !signed) {
    return jsonError('Yükleme bağlantısı oluşturulamadı', 500)
  }

  return new Response(
    JSON.stringify({ uploadId, path: signed.path, token: signed.token, bucket: BUCKET }),
    { status: 200, headers: jsonHeaders },
  )
})

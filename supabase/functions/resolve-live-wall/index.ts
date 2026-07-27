import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }
const BUCKET = 'event-media'
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{21}$/
const SIGNED_URL_TTL_SECONDS = 120
const MAX_PHOTOS = 200

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

function notFound(): Response {
  return new Response(JSON.stringify({ error: 'Bu duvar bulunamadı' }), {
    status: 404,
    headers: jsonHeaders,
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let token: unknown
  try {
    ;({ token } = await req.json())
  } catch {
    return new Response(JSON.stringify({ error: 'Geçersiz istek' }), {
      status: 400,
      headers: jsonHeaders,
    })
  }

  if (typeof token !== 'string' || !TOKEN_PATTERN.test(token)) {
    return notFound()
  }

  const { data: event, error: eventError } = await supabaseAdmin
    .from('events')
    .select('id, name')
    .eq('live_wall_token', token)
    .eq('live_wall_enabled', true)
    .maybeSingle()

  if (eventError || !event) {
    return notFound()
  }

  // Sabit filtre — client'tan hiçbir parametre bu koşulları etkilemez:
  // sadece onaylı, teknik olarak hazır ve fotoğraf türündeki yüklemeler döner.
  const { data: uploads, error: uploadsError } = await supabaseAdmin
    .from('uploads')
    .select('id, file_path')
    .eq('event_id', event.id)
    .eq('moderation_status', 'approved')
    .eq('status', 'ready')
    .eq('file_type', 'image')
    .order('created_at', { ascending: false })
    .limit(MAX_PHOTOS)

  if (uploadsError) {
    return new Response(JSON.stringify({ error: 'Sunucu hatası, lütfen tekrar deneyin' }), {
      status: 500,
      headers: jsonHeaders,
    })
  }

  const paths = uploads.map((upload) => upload.file_path)
  const signedUrlByPath: Record<string, string> = {}

  if (paths.length > 0) {
    const { data: signed } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS)

    for (const item of signed ?? []) {
      if (item.path && item.signedUrl) {
        signedUrlByPath[item.path] = item.signedUrl
      }
    }
  }

  const photos = uploads
    .filter((upload) => signedUrlByPath[upload.file_path])
    .map((upload) => ({ id: upload.id, url: signedUrlByPath[upload.file_path] }))

  return new Response(JSON.stringify({ eventName: event.name, photos }), {
    status: 200,
    headers: jsonHeaders,
  })
})

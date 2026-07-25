import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { ALLOWED_MIME_TYPES, matchesMimeSignature } from '../_shared/media.ts'

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }
const BUCKET = 'event-media'
const SIGNATURE_PROBE_BYTES = 32
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), { status, headers: jsonHeaders })
}

async function rejectUpload(uploadId: string, path: string, reason: string): Promise<Response> {
  await supabaseAdmin.storage.from(BUCKET).remove([path])
  await supabaseAdmin.from('uploads').update({ status: 'rejected' }).eq('id', uploadId)
  return jsonError(reason, 422)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let uploadId: unknown
  try {
    ;({ uploadId } = await req.json())
  } catch {
    return jsonError('Geçersiz istek', 400)
  }

  if (typeof uploadId !== 'string' || !UUID_PATTERN.test(uploadId)) {
    return jsonError('Geçersiz istek', 400)
  }

  const { data: upload, error: uploadError } = await supabaseAdmin
    .from('uploads')
    .select('id, file_path, mime_type, status')
    .eq('id', uploadId)
    .maybeSingle()

  if (uploadError || !upload) {
    return jsonError('Yükleme bulunamadı', 404)
  }

  if (upload.status !== 'pending') {
    return new Response(JSON.stringify({ status: upload.status }), {
      status: 200,
      headers: jsonHeaders,
    })
  }

  const mediaConfig = ALLOWED_MIME_TYPES[upload.mime_type]
  if (!mediaConfig) {
    return await rejectUpload(upload.id, upload.file_path, 'Desteklenmeyen dosya türü')
  }

  const [eventFolder, fileName] = upload.file_path.split('/')
  const { data: listResult, error: listError } = await supabaseAdmin.storage
    .from(BUCKET)
    .list(eventFolder, { search: fileName })

  const objectMeta = listResult?.find((item) => item.name === fileName)

  if (listError || !objectMeta) {
    return await rejectUpload(upload.id, upload.file_path, 'Dosya bulunamadı')
  }

  const verifiedSize = objectMeta.metadata?.size as number | undefined
  if (!verifiedSize || verifiedSize > mediaConfig.maxBytes) {
    return await rejectUpload(upload.id, upload.file_path, 'Dosya boyutu limiti aşıyor')
  }

  const probeResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${upload.file_path}`, {
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      apikey: SERVICE_ROLE_KEY,
      Range: `bytes=0-${SIGNATURE_PROBE_BYTES - 1}`,
    },
  })

  if (!probeResponse.ok) {
    return await rejectUpload(upload.id, upload.file_path, 'Dosya doğrulanamadı')
  }

  const probeBytes = new Uint8Array(await probeResponse.arrayBuffer())
  if (!matchesMimeSignature(upload.mime_type, probeBytes)) {
    return await rejectUpload(upload.id, upload.file_path, 'Dosya içeriği beklenen türle eşleşmiyor')
  }

  const { error: updateError } = await supabaseAdmin
    .from('uploads')
    .update({ status: 'ready', verified_file_size: verifiedSize })
    .eq('id', upload.id)

  if (updateError) {
    return jsonError('Sunucu hatası, lütfen tekrar deneyin', 500)
  }

  return new Response(JSON.stringify({ status: 'ready' }), { status: 200, headers: jsonHeaders })
})

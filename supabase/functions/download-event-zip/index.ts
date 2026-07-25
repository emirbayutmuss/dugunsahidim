import { createClient } from 'jsr:@supabase/supabase-js@2'
import { ZipWriter } from 'jsr:@zip-js/zip-js'
import { corsHeaders } from '../_shared/cors.ts'

const BUCKET = 'event-media'
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

function textResponse(message: string, status: number): Response {
  return new Response(message, { status, headers: corsHeaders })
}

// ASCII-only: this feeds a Content-Disposition header value (and, for zip entry
// names, keeps things simple) — non-Latin1 characters (e.g. Turkish ğ/ş/ı) make
// the Response constructor throw "Value is not a valid ByteString".
function sanitizeFileNamePart(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const eventId = url.searchParams.get('eventId')
  if (!eventId) {
    return textResponse('eventId gerekli', 400)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return textResponse('Yetkisiz', 401)
  }

  // RLS-scoped client, acting as the calling owner — never sees another owner's event.
  const supabaseUser = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })

  const { data: event, error: eventError } = await supabaseUser
    .from('events')
    .select('id, name')
    .eq('id', eventId)
    .maybeSingle()

  if (eventError || !event) {
    return textResponse('Etkinlik bulunamadı', 404)
  }

  const { data: uploads, error: uploadsError } = await supabaseUser
    .from('uploads')
    .select('file_path, guest_name, created_at')
    .eq('event_id', eventId)
    .eq('status', 'ready')
    .order('created_at', { ascending: true })

  if (uploadsError || !uploads || uploads.length === 0) {
    return textResponse('İndirilecek dosya yok', 404)
  }

  // Service-role client only for the actual file bytes — ownership already verified above.
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

  const zipFileStream = new TransformStream()
  const zipWriter = new ZipWriter(zipFileStream.writable)

  const buildZip = async () => {
    try {
      let index = 0
      for (const upload of uploads) {
        index += 1
        const { data: fileStream, error: downloadError } = await supabaseAdmin.storage
          .from(BUCKET)
          .download(upload.file_path)
          .asStream()

        // A single missing/corrupt object shouldn't fail the whole archive — skip it.
        if (downloadError || !fileStream) continue

        const extension = upload.file_path.split('.').pop() ?? 'bin'
        const guestLabel = sanitizeFileNamePart(upload.guest_name ?? 'misafir')
        const entryName = `${String(index).padStart(3, '0')}-${guestLabel}.${extension}`

        await zipWriter.add(entryName, fileStream)
      }
      await zipWriter.close()
    } catch (zipError) {
      await zipFileStream.writable.abort(zipError)
    }
  }

  buildZip()

  const zipFileName = sanitizeFileNamePart(event.name) || 'dugun-sahidim'

  return new Response(zipFileStream.readable, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipFileName}.zip"`,
    },
  })
})

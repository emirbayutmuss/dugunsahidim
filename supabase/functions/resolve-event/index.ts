import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const jsonHeaders = { ...corsHeaders, 'Content-Type': 'application/json' }

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const SLUG_PATTERN = /^[a-z0-9_-]{8,32}$/
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function notFound(): Response {
  return new Response(JSON.stringify({ error: 'Etkinlik bulunamadı' }), {
    status: 404,
    headers: jsonHeaders,
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  let slug: unknown
  let visitorId: unknown
  try {
    ;({ slug, visitorId } = await req.json())
  } catch {
    return new Response(JSON.stringify({ error: 'Geçersiz istek' }), {
      status: 400,
      headers: jsonHeaders,
    })
  }

  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug)) {
    return notFound()
  }

  const { data, error } = await supabaseAdmin
    .from('events')
    .select('id, name, event_date, status')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) {
    return notFound()
  }

  // Görüntülenme sayacı: best-effort — analytics hiçbir zaman misafir
  // deneyimini bozmamalı, bu yüzden hata sessizce yutulur.
  if (typeof visitorId === 'string' && UUID_PATTERN.test(visitorId)) {
    try {
      await supabaseAdmin
        .from('event_page_views')
        .upsert(
          { event_id: data.id, visitor_id: visitorId },
          { onConflict: 'event_id,visitor_id', ignoreDuplicates: true },
        )
    } catch {
      // görüntülenme kaydı başarısız olsa bile etkinlik bilgisini dönmeye devam et
    }
  }

  const { id: _id, ...publicEventInfo } = data
  return new Response(JSON.stringify(publicEventInfo), { status: 200, headers: jsonHeaders })
})

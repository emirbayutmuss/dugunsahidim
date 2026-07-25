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
  try {
    ;({ slug } = await req.json())
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
    .select('name, event_date, status')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) {
    return notFound()
  }

  return new Response(JSON.stringify(data), { status: 200, headers: jsonHeaders })
})

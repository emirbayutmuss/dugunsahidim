import { supabase } from '@/lib/supabaseClient'

export interface EventAnalytics {
  viewCount: number
  conversionCount: number
}

export async function fetchEventAnalytics(eventId: string): Promise<EventAnalytics> {
  const [viewsResult, uploadsResult] = await Promise.all([
    supabase
      .from('event_page_views')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId),
    supabase
      .from('uploads')
      .select('visitor_id')
      .eq('event_id', eventId)
      .eq('status', 'ready')
      .not('visitor_id', 'is', null),
  ])

  if (viewsResult.error) {
    throw new Error(viewsResult.error.message)
  }
  if (uploadsResult.error) {
    throw new Error(uploadsResult.error.message)
  }

  const conversionCount = new Set(uploadsResult.data.map((row) => row.visitor_id)).size

  return {
    viewCount: viewsResult.count ?? 0,
    conversionCount,
  }
}

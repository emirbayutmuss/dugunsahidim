import { supabase } from '@/lib/supabaseClient'
import { generateEventSlug } from '@/lib/slug'
import type { EventRow } from '@/lib/types'

const UNIQUE_VIOLATION = '23505'
const MAX_SLUG_ATTEMPTS = 3

export interface EventWithStats extends EventRow {
  uploadCount: number
  thumbnailPath: string | null
}

export async function fetchEvents(): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function fetchEventsWithStats(): Promise<EventWithStats[]> {
  const events = await fetchEvents()
  if (events.length === 0) return []

  const { data: uploads, error } = await supabase
    .from('uploads')
    .select('event_id, file_path, file_type')
    .in(
      'event_id',
      events.map((event) => event.id),
    )
    .eq('status', 'ready')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  const countByEvent = new Map<string, number>()
  const thumbnailByEvent = new Map<string, string>()

  for (const upload of uploads) {
    countByEvent.set(upload.event_id, (countByEvent.get(upload.event_id) ?? 0) + 1)
    // uploads are already newest-first, so the first image we see per event is the most recent one
    if (!thumbnailByEvent.has(upload.event_id) && upload.file_type === 'image') {
      thumbnailByEvent.set(upload.event_id, upload.file_path)
    }
  }

  return events.map((event) => ({
    ...event,
    uploadCount: countByEvent.get(event.id) ?? 0,
    thumbnailPath: thumbnailByEvent.get(event.id) ?? null,
  }))
}

export async function fetchEventById(eventId: string): Promise<EventRow | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function createEvent(ownerId: string, name: string, eventDate: string | null): Promise<EventRow> {
  for (let attempt = 0; attempt < MAX_SLUG_ATTEMPTS; attempt++) {
    const slug = generateEventSlug()
    const { data, error } = await supabase
      .from('events')
      .insert({ owner_id: ownerId, name, event_date: eventDate, slug })
      .select()
      .single()

    if (!error) {
      return data
    }

    if (error.code !== UNIQUE_VIOLATION) {
      throw new Error(error.message)
    }
  }

  throw new Error('Etkinlik oluşturulamadı, lütfen tekrar deneyin')
}

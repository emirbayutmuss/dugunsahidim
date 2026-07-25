import { supabase } from '@/lib/supabaseClient'
import { generateEventSlug } from '@/lib/slug'
import type { EventRow } from '@/lib/types'

const UNIQUE_VIOLATION = '23505'
const MAX_SLUG_ATTEMPTS = 3

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

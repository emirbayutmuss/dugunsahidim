import { supabase } from '@/lib/supabaseClient'

export interface LiveWallPhoto {
  id: string
  url: string
}

export interface LiveWallData {
  eventName: string
  photos: LiveWallPhoto[]
}

export async function fetchLiveWall(token: string): Promise<LiveWallData | null> {
  const { data, error } = await supabase.functions.invoke<LiveWallData>('resolve-live-wall', {
    body: { token },
  })

  if (error || !data) {
    return null
  }

  return data
}

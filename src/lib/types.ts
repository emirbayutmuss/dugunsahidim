export type EventStatus = 'active' | 'paused' | 'closed'
export type MediaFamily = 'image' | 'video'
// status = teknik yükleme durumu, moderation_status = içerik onay durumu — ayrı kavramlar
export type ModerationStatus = 'pending' | 'approved' | 'rejected'

export interface EventRow {
  id: string
  owner_id: string
  name: string
  event_date: string | null
  slug: string
  status: EventStatus
  max_uploads: number
  max_storage_bytes: number
  live_wall_enabled: boolean
  live_wall_token: string | null
  created_at: string
}

export interface UploadRow {
  id: string
  event_id: string
  guest_name: string | null
  file_path: string
  file_type: MediaFamily
  mime_type: string
  verified_file_size: number | null
  moderation_status: ModerationStatus
  created_at: string
}

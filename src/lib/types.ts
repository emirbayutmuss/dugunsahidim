export type EventStatus = 'active' | 'paused' | 'closed'
export type MediaFamily = 'image' | 'video'

export interface EventRow {
  id: string
  owner_id: string
  name: string
  event_date: string | null
  slug: string
  status: EventStatus
  max_uploads: number
  max_storage_bytes: number
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
  created_at: string
}

import { FunctionsHttpError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { getVisitorId } from '@/lib/visitor'

export type MediaFamily = 'image' | 'video'

interface MediaTypeConfig {
  family: MediaFamily
  maxBytes: number
}

const IMAGE_MAX_BYTES = 15 * 1024 * 1024
const VIDEO_MAX_BYTES = 100 * 1024 * 1024

export const ALLOWED_MIME_TYPES: Record<string, MediaTypeConfig> = {
  'image/jpeg': { family: 'image', maxBytes: IMAGE_MAX_BYTES },
  'image/png': { family: 'image', maxBytes: IMAGE_MAX_BYTES },
  'image/webp': { family: 'image', maxBytes: IMAGE_MAX_BYTES },
  'image/heic': { family: 'image', maxBytes: IMAGE_MAX_BYTES },
  'image/heif': { family: 'image', maxBytes: IMAGE_MAX_BYTES },
  'video/mp4': { family: 'video', maxBytes: VIDEO_MAX_BYTES },
  'video/quicktime': { family: 'video', maxBytes: VIDEO_MAX_BYTES },
  'video/webm': { family: 'video', maxBytes: VIDEO_MAX_BYTES },
}

export function validateFileClientSide(file: File): string | null {
  const config = ALLOWED_MIME_TYPES[file.type]
  if (!config) {
    return 'Desteklenmeyen dosya türü. Lütfen fotoğraf (JPEG, PNG, WEBP, HEIC) veya video (MP4, MOV, WEBM) seçin.'
  }
  if (file.size > config.maxBytes) {
    const maxMb = Math.round(config.maxBytes / (1024 * 1024))
    return `Dosya çok büyük. En fazla ${maxMb}MB olmalı.`
  }
  return null
}

interface TicketResponse {
  uploadId: string
  path: string
  token: string
  bucket: string
}

interface ConfirmResponse {
  status: 'ready' | 'rejected' | 'pending' | 'processing'
}

async function extractFunctionErrorMessage(error: unknown, fallback: string): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    try {
      const body = await error.context.json()
      if (body && typeof body.error === 'string') {
        return body.error
      }
    } catch {
      // fall through to fallback
    }
  }
  return fallback
}

export async function uploadGuestMedia(
  slug: string,
  file: File,
  guestName: string | null,
): Promise<void> {
  const clientError = validateFileClientSide(file)
  if (clientError) {
    throw new Error(clientError)
  }

  const { data: ticket, error: ticketError } = await supabase.functions.invoke<TicketResponse>(
    'create-upload-ticket',
    {
      body: {
        slug,
        guestName,
        mimeType: file.type,
        declaredSize: file.size,
        visitorId: getVisitorId(),
      },
    },
  )

  if (ticketError || !ticket) {
    throw new Error(
      await extractFunctionErrorMessage(ticketError, 'Yükleme başlatılamadı, lütfen tekrar deneyin'),
    )
  }

  const { error: uploadError } = await supabase.storage
    .from(ticket.bucket)
    .uploadToSignedUrl(ticket.path, ticket.token, file)

  if (uploadError) {
    throw new Error('Dosya yüklenemedi, lütfen tekrar deneyin')
  }

  const { data: confirmed, error: confirmError } = await supabase.functions.invoke<ConfirmResponse>(
    'confirm-upload',
    { body: { uploadId: ticket.uploadId } },
  )

  if (confirmError || !confirmed) {
    throw new Error(
      await extractFunctionErrorMessage(confirmError, 'Dosya doğrulanamadı, lütfen tekrar deneyin'),
    )
  }

  if (confirmed.status === 'rejected') {
    throw new Error('Dosya kabul edilmedi. Lütfen desteklenen bir fotoğraf ya da video deneyin.')
  }
}

export type MediaFamily = 'image' | 'video'

interface MediaTypeConfig {
  family: MediaFamily
  extension: string
  maxBytes: number
}

const IMAGE_MAX_BYTES = 15 * 1024 * 1024
const VIDEO_MAX_BYTES = 100 * 1024 * 1024

export const ALLOWED_MIME_TYPES: Record<string, MediaTypeConfig> = {
  'image/jpeg': { family: 'image', extension: 'jpg', maxBytes: IMAGE_MAX_BYTES },
  'image/png': { family: 'image', extension: 'png', maxBytes: IMAGE_MAX_BYTES },
  'image/webp': { family: 'image', extension: 'webp', maxBytes: IMAGE_MAX_BYTES },
  'image/heic': { family: 'image', extension: 'heic', maxBytes: IMAGE_MAX_BYTES },
  'image/heif': { family: 'image', extension: 'heif', maxBytes: IMAGE_MAX_BYTES },
  'video/mp4': { family: 'video', extension: 'mp4', maxBytes: VIDEO_MAX_BYTES },
  'video/quicktime': { family: 'video', extension: 'mov', maxBytes: VIDEO_MAX_BYTES },
  'video/webm': { family: 'video', extension: 'webm', maxBytes: VIDEO_MAX_BYTES },
}

type SignatureFamily = 'jpeg' | 'png' | 'webp' | 'ftyp' | 'webm'

const MIME_SIGNATURE_FAMILY: Record<string, SignatureFamily> = {
  'image/jpeg': 'jpeg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'ftyp',
  'image/heif': 'ftyp',
  'video/mp4': 'ftyp',
  'video/quicktime': 'ftyp',
  'video/webm': 'webm',
}

/**
 * HEIC/HEIF and MP4/MOV all share the ISO-BMFF `ftyp` box signature, so this
 * distinguishes containers, not exact sub-formats. Good enough to block
 * disguised non-media files; not meant to police HEIC-vs-MP4 mislabeling.
 */
export function detectSignatureFamily(bytes: Uint8Array): SignatureFamily | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg'
  }
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'png'
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'webp'
  }
  if (bytes.length >= 8 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return 'ftyp'
  }
  if (bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return 'webm'
  }
  return null
}

export function matchesMimeSignature(mimeType: string, bytes: Uint8Array): boolean {
  const expected = MIME_SIGNATURE_FAMILY[mimeType]
  if (!expected) return false
  return detectSignatureFamily(bytes) === expected
}

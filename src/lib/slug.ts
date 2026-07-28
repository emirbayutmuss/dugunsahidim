import { customAlphabet, nanoid } from 'nanoid'

const SLUG_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
const SLUG_LENGTH = 10

const generateId = customAlphabet(SLUG_ALPHABET, SLUG_LENGTH)

export function generateEventSlug(): string {
  return generateId()
}

// nanoid'in varsayılan üreteci: 21 karakter, 64 sembollük alfabe — slug'dan
// (36 sembol, 10 karakter) çok daha yüksek entropi. Duvar linki mekanda
// fiziksel olarak açık kalacağı için tahmin edilemezlik önceliği daha yüksek.
export function generateLiveWallToken(): string {
  return nanoid()
}

// live_wall_token ile aynı gerekçe: e-postayla giden indirme linki de tahmin
// edilemez olmalı — link ele geçerse galeriye erişim verir.
export function generateGalleryDownloadToken(): string {
  return nanoid()
}

import { customAlphabet } from 'nanoid'

const SLUG_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz'
const SLUG_LENGTH = 10

const generateId = customAlphabet(SLUG_ALPHABET, SLUG_LENGTH)

export function generateEventSlug(): string {
  return generateId()
}

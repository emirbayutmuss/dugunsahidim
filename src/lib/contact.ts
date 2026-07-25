import { supabase } from '@/lib/supabaseClient'

interface ContactMessageInput {
  name: string
  email: string
  message: string
  /** Hidden honeypot field — bots tend to fill every input; humans never see it. */
  honeypot: string
}

export async function submitContactMessage(input: ContactMessageInput): Promise<void> {
  if (input.honeypot.trim().length > 0) {
    // Silently succeed for bots without writing anything.
    return
  }

  const { error } = await supabase.from('contact_messages').insert({
    name: input.name.trim(),
    email: input.email.trim(),
    message: input.message.trim(),
  })

  if (error) {
    throw new Error('Mesajınız gönderilemedi, lütfen tekrar deneyin')
  }
}

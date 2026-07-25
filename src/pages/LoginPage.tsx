import { type FormEvent, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function LoginPage() {
  const { session, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  if (!isLoading && session) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSending(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    setIsSending(false)

    if (error) {
      toast.error('Bağlantı gönderilemedi', { description: error.message })
      return
    }

    setIsSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <h1 className="font-heading text-3xl text-primary">Düğün Şahidim</h1>
            <p className="text-sm text-muted-foreground">
              Etkinliklerinizi yönetmek için giriş yapın
            </p>
          </CardHeader>
          <CardContent>
            {isSent ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-foreground"
              >
                <strong className="text-primary">{email}</strong> adresine bir giriş bağlantısı
                gönderdik. Gelen kutunuzu kontrol edin.
              </motion.p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta adresi</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="ornek@eposta.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending ? 'Gönderiliyor…' : 'Giriş bağlantısı gönder'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

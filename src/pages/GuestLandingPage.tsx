import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { GuestUploadForm } from '@/components/GuestUploadForm'

interface PublicEventInfo {
  name: string
  event_date: string | null
  status: 'active' | 'paused' | 'closed'
}

function formatEventDate(eventDate: string | null): string {
  if (!eventDate) return ''
  return new Date(eventDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function GuestLandingPage() {
  const { slug } = useParams<{ slug: string }>()
  const [event, setEvent] = useState<PublicEventInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    supabase.functions
      .invoke<PublicEventInfo>('resolve-event', { body: { slug } })
      .then(({ data, error }) => {
        if (!error && data) {
          setEvent(data)
        }
      })
      .finally(() => setIsLoading(false))
  }, [slug])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <Card className="border-border/60 text-center shadow-lg">
          {isLoading ? (
            <CardContent className="py-16 text-muted-foreground">Yükleniyor…</CardContent>
          ) : !event ? (
            <CardContent className="py-16">
              <p className="text-foreground">Bu etkinlik bulunamadı.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                QR kodu tekrar okutmayı deneyin.
              </p>
            </CardContent>
          ) : (
            <>
              <CardHeader className="space-y-2">
                <p className="text-sm text-accent-foreground">Düğün Şahidim'e hoş geldiniz</p>
                <h1 className="font-heading text-3xl text-primary">{event.name}</h1>
                {event.event_date && (
                  <p className="text-sm text-muted-foreground">{formatEventDate(event.event_date)}</p>
                )}
              </CardHeader>
              <CardContent>
                {event.status === 'active' ? (
                  <GuestUploadForm slug={slug!} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Bu etkinlik şu anda yükleme kabul etmiyor.
                  </p>
                )}
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

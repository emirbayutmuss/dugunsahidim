import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { GuestUploadForm } from '@/components/GuestUploadForm'
import { AuroraBackground } from '@/components/AuroraBackground'
import { TextReveal } from '@/components/TextReveal'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

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

  useDocumentMeta({
    title: event ? `${event.name} - Düğün Şahidim` : 'Düğün Şahidim',
    description: event
      ? `${event.name} için anılarınızı paylaşın — uygulama indirmeden, giriş yapmadan QR kodu okutarak fotoğraf ve video yükleyin.`
      : 'QR kodu okutarak uygulama indirmeden, giriş yapmadan fotoğraf ve video paylaşın.',
    ogType: 'article',
  })

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
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 py-10">
      <AuroraBackground />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-border/60 bg-card/90 text-center shadow-xl backdrop-blur-sm">
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
              <CardHeader className="space-y-3 pt-2 pb-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-2 text-xs tracking-wide text-accent-foreground uppercase"
                >
                  <Heart className="size-3.5 fill-accent text-accent" />
                  Düğün Şahidim'e hoş geldiniz
                  <Heart className="size-3.5 fill-accent text-accent" />
                </motion.div>

                <h1 className="font-heading text-4xl leading-tight text-primary">
                  <TextReveal text={event.name} delayStart={0.15} />
                </h1>

                {event.event_date && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-sm text-muted-foreground"
                  >
                    {formatEventDate(event.event_date)}
                  </motion.p>
                )}
              </CardHeader>
              <CardContent>
                {event.status === 'active' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.75 }}
                  >
                    <GuestUploadForm slug={slug!} />
                  </motion.div>
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

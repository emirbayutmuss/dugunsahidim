import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { QRCodeCanvas } from 'qrcode.react'
import { fetchEventById } from '@/lib/events'
import type { EventRow } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { EventGallery } from '@/components/EventGallery'

function formatEventDate(eventDate: string | null): string {
  if (!eventDate) return 'Tarih belirtilmedi'
  return new Date(eventDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<EventRow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!eventId) return

    fetchEventById(eventId)
      .then((result) => {
        if (!result) {
          setNotFound(true)
          return
        }
        setEvent(result)
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Etkinlik yüklenemedi'
        toast.error(message)
        setNotFound(true)
      })
      .finally(() => setIsLoading(false))
  }, [eventId])

  if (!eventId) {
    return <Navigate to="/dashboard" replace />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Yükleniyor…
      </div>
    )
  }

  if (notFound || !event) {
    return <Navigate to="/dashboard" replace />
  }

  const guestUrl = `${window.location.origin}/e/${event.slug}`

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${event!.slug}-qr.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
          ← Etkinliklerim
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-4 space-y-6"
        >
          <Card>
            <CardHeader className="text-center">
              <h1 className="font-heading text-3xl text-primary">{event.name}</h1>
              <p className="text-sm text-muted-foreground">{formatEventDate(event.event_date)}</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="rounded-xl border border-border bg-white p-4">
                <QRCodeCanvas ref={canvasRef} value={guestUrl} size={220} marginSize={2} level="M" />
              </div>

              <p className="break-all text-center text-sm text-muted-foreground">{guestUrl}</p>

              <Button onClick={handleDownload}>QR Kodu İndir (PNG)</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-heading text-xl text-foreground">Galeri</h2>
            </CardHeader>
            <CardContent>
              <EventGallery eventId={event.id} eventName={event.name} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

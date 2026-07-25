import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { fetchEvents } from '@/lib/events'
import type { EventRow } from '@/lib/types'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { CreateEventDialog } from '@/components/CreateEventDialog'
import { SiteHeader } from '@/components/SiteHeader'

function formatEventDate(eventDate: string | null): string {
  if (!eventDate) return 'Tarih belirtilmedi'
  return new Date(eventDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function DashboardPage() {
  const [events, setEvents] = useState<EventRow[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
      .then(setEvents)
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Etkinlikler yüklenemedi'
        toast.error(message)
      })
      .finally(() => setIsLoading(false))
  }, [])

  function handleCreated(event: EventRow) {
    setEvents((previous) => [event, ...previous])
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-3xl text-primary">Etkinliklerim</h1>
          <CreateEventDialog onCreated={handleCreated} />
        </header>

        {isLoading ? (
          <p className="text-muted-foreground">Yükleniyor…</p>
        ) : events.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              Henüz bir etkinlik oluşturmadınız. "Yeni Etkinlik" ile başlayın.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
              >
                <Link to={`/dashboard/e/${event.id}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <h2 className="font-heading text-xl text-foreground">{event.name}</h2>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {formatEventDate(event.event_date)}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">/e/{event.slug}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

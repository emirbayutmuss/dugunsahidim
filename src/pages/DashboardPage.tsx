import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { CalendarDays, ImageIcon, ImageOff, PartyPopper } from 'lucide-react'
import { fetchEventsWithStats, type EventWithStats } from '@/lib/events'
import { createSignedUrlMap } from '@/lib/gallery'
import type { EventRow } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { CreateEventDialog } from '@/components/CreateEventDialog'
import { SiteHeader } from '@/components/SiteHeader'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageTransition } from '@/components/PageTransition'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

function formatEventDate(eventDate: string | null): string {
  if (!eventDate) return 'Tarih belirtilmedi'
  return new Date(eventDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function DashboardPage() {
  useDocumentMeta({
    title: 'Panelim - Düğün Şahidim',
    description:
      'Panelinizden etkinliklerinizi yönetin, QR kodlarınızı indirin, misafirlerinizin yüklediği fotoğraf ve videoları görüntüleyip toplu olarak indirin.',
  })

  const [events, setEvents] = useState<EventWithStats[]>([])
  const [thumbnailMap, setThumbnailMap] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEventsWithStats()
      .then(async (result) => {
        setEvents(result)
        const thumbnailPaths = result
          .map((event) => event.thumbnailPath)
          .filter((path): path is string => Boolean(path))

        if (thumbnailPaths.length > 0) {
          const map = await createSignedUrlMap(thumbnailPaths)
          setThumbnailMap(map)
        }
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Etkinlikler yüklenemedi'
        toast.error(message)
      })
      .finally(() => setIsLoading(false))
  }, [])

  function handleCreated(event: EventRow) {
    setEvents((previous) => [{ ...event, uploadCount: 0, thumbnailPath: null }, ...previous])
  }

  const totalEvents = events.length
  const totalUploads = events.reduce((sum, event) => sum + event.uploadCount, 0)

  return (
    <PageTransition className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Breadcrumb items={[{ label: 'Panelim' }]} />
        <header className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-primary">Etkinliklerim</h1>
          <CreateEventDialog onCreated={handleCreated} />
        </header>

        {!isLoading && events.length > 0 && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            <Card className="border-border/60">
              <CardContent className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <CalendarDays className="size-5" />
                </div>
                <div>
                  <p className="font-heading text-2xl text-foreground">{totalEvents}</p>
                  <p className="text-sm text-muted-foreground">Toplam etkinlik</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60">
              <CardContent className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <ImageIcon className="size-5" />
                </div>
                <div>
                  <p className="font-heading text-2xl text-foreground">{totalUploads}</p>
                  <p className="text-sm text-muted-foreground">Toplam yüklenen anı</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Yükleniyor…</p>
        ) : events.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
                <PartyPopper className="size-7" />
              </div>
              <h2 className="font-heading text-xl text-foreground">İlk etkinliğini oluştur</h2>
              <p className="max-w-sm text-sm text-muted-foreground">
                Bir düğün ya da etkinlik oluştur, sana özel QR kodunu al ve misafirlerinin
                anılarını toplamaya başla.
              </p>
              <CreateEventDialog onCreated={handleCreated} />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((event, index) => {
              const thumbnailUrl = event.thumbnailPath ? thumbnailMap[event.thumbnailPath] : undefined

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.35, delay: index * 0.05, ease: 'easeOut' } }}
                  whileHover={{ scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                  whileTap={{ scale: 0.985, transition: { type: 'spring', stiffness: 400, damping: 17 } }}
                >
                  <Link to={`/dashboard/e/${event.id}`}>
                    <Card className="overflow-hidden [--card-spacing:0px] transition-shadow hover:shadow-md">
                      <div className="flex">
                        <div className="flex size-24 shrink-0 items-center justify-center bg-muted">
                          {thumbnailUrl ? (
                            <img src={thumbnailUrl} alt="" className="size-full object-cover" />
                          ) : (
                            <ImageOff className="size-6 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1 p-4">
                          <h2 className="truncate font-heading text-lg text-foreground">
                            {event.name}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {formatEventDate(event.event_date)}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {event.uploadCount} anı · /e/{event.slug}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </PageTransition>
  )
}

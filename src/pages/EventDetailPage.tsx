import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { QRCodeCanvas } from 'qrcode.react'
import { Copy, RefreshCw } from 'lucide-react'
import { fetchEventById, regenerateLiveWallToken, setLiveWallEnabled } from '@/lib/events'
import { fetchEventAnalytics, type EventAnalytics } from '@/lib/analytics'
import type { EventRow } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EventGallery } from '@/components/EventGallery'
import { SiteHeader } from '@/components/SiteHeader'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageTransition } from '@/components/PageTransition'
import { Pressable } from '@/components/Pressable'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

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
  const [analytics, setAnalytics] = useState<EventAnalytics | null>(null)
  const [isTogglingWall, setIsTogglingWall] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useDocumentMeta({
    title: event ? `${event.name} - Düğün Şahidim` : 'Etkinlik - Düğün Şahidim',
    description: event
      ? `"${event.name}" etkinliğinin QR kodunu indirin, misafirlerinizin yüklediği fotoğraf ve videoları galeride görüntüleyip toplu olarak indirin.`
      : 'Etkinliğinizin QR kodunu ve misafir galerisini görüntüleyin.',
  })

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

  useEffect(() => {
    if (!eventId) return

    fetchEventAnalytics(eventId)
      .then(setAnalytics)
      .catch(() => {
        // istatistikler tali bir özellik — yüklenemezse sessizce atlanır
      })
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
  const wallUrl = event.live_wall_token
    ? `${window.location.origin}/duvar/${event.live_wall_token}`
    : null
  const conversionRate =
    analytics && analytics.viewCount > 0
      ? Math.round((analytics.conversionCount / analytics.viewCount) * 100)
      : null

  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${event!.slug}-qr.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  async function handleToggleLiveWall(enabled: boolean) {
    if (!event) return
    setIsTogglingWall(true)
    try {
      const updated = await setLiveWallEnabled(event.id, enabled, event.live_wall_token)
      setEvent(updated)
      toast.success(enabled ? 'Canlı duvar etkinleştirildi' : 'Canlı duvar kapatıldı')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'İşlem başarısız oldu'
      toast.error(message)
    } finally {
      setIsTogglingWall(false)
    }
  }

  async function handleRegenerateToken() {
    if (!event) return
    setIsRegenerating(true)
    try {
      const updated = await regenerateLiveWallToken(event.id)
      setEvent(updated)
      setIsRegenerateDialogOpen(false)
      toast.success('Link yenilendi, eski link artık çalışmıyor')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'İşlem başarısız oldu'
      toast.error(message)
    } finally {
      setIsRegenerating(false)
    }
  }

  async function handleCopyWallLink(wallUrl: string) {
    try {
      await navigator.clipboard.writeText(wallUrl)
      toast.success('Link kopyalandı')
    } catch {
      toast.error('Link kopyalanamadı')
    }
  }

  return (
    <PageTransition className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <Breadcrumb
          items={[
            { label: 'Panelim', to: '/dashboard' },
            { label: event.name },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-4 space-y-6"
        >
          <Card>
            <CardHeader className="text-center">
              <h1 className="font-heading text-4xl font-bold tracking-tight text-primary">{event.name}</h1>
              <p className="text-sm text-muted-foreground">{formatEventDate(event.event_date)}</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              <div className="rounded-xl border border-border bg-white p-4">
                <QRCodeCanvas ref={canvasRef} value={guestUrl} size={220} marginSize={2} level="M" />
              </div>

              <p className="break-all text-center text-sm text-muted-foreground">{guestUrl}</p>

              <Pressable>
                <Button onClick={handleDownload}>QR Kodu İndir (PNG)</Button>
              </Pressable>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-heading text-xl text-foreground">Canlı Duvar</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {!event.live_wall_enabled ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Mekandaki bir TV/projeksiyona bağlayabileceğiniz özel bir link oluşturun —
                    misafirlerin yüklediği onaylı fotoğraflar otomatik slayt olarak akar.
                  </p>
                  <Pressable>
                    <Button onClick={() => handleToggleLiveWall(true)} disabled={isTogglingWall}>
                      {isTogglingWall ? 'Etkinleştiriliyor…' : 'Canlı Duvarı Etkinleştir'}
                    </Button>
                  </Pressable>
                </>
              ) : (
                <>
                  <p className="break-all text-sm text-muted-foreground">{wallUrl}</p>
                  <div className="flex flex-wrap gap-2">
                    <Pressable>
                      <Button variant="outline" onClick={() => handleCopyWallLink(wallUrl!)}>
                        <Copy className="size-4" /> Linki Kopyala
                      </Button>
                    </Pressable>
                    <Pressable>
                      <Button variant="outline" onClick={() => setIsRegenerateDialogOpen(true)}>
                        <RefreshCw className="size-4" /> Linki Yenile
                      </Button>
                    </Pressable>
                    <Pressable>
                      <Button
                        variant="outline"
                        onClick={() => handleToggleLiveWall(false)}
                        disabled={isTogglingWall}
                      >
                        {isTogglingWall ? 'Kapatılıyor…' : 'Kapat'}
                      </Button>
                    </Pressable>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-heading text-xl text-foreground">İstatistikler</h2>
            </CardHeader>
            <CardContent>
              {!analytics ? (
                <p className="text-sm text-muted-foreground">Yükleniyor…</p>
              ) : analytics.viewCount === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Henüz kimse QR kodu okutup sayfayı görüntülemedi.
                </p>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-8 text-center">
                  <div>
                    <p className="font-heading text-3xl text-primary">{analytics.viewCount}</p>
                    <p className="text-sm text-muted-foreground">Sayfayı gören</p>
                  </div>
                  <div>
                    <p className="font-heading text-3xl text-primary">{analytics.conversionCount}</p>
                    <p className="text-sm text-muted-foreground">Yükleme yapan</p>
                  </div>
                  {conversionRate !== null && (
                    <div>
                      <p className="font-heading text-3xl text-primary">%{conversionRate}</p>
                      <p className="text-sm text-muted-foreground">Dönüşüm oranı</p>
                    </div>
                  )}
                </div>
              )}
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

      <Dialog open={isRegenerateDialogOpen} onOpenChange={setIsRegenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Linki yenile?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Yeni bir link oluşturulur ve eski link anında geçersiz olur. Mekandaki ekranda eski
            linki kullanıyorsanız, ekranı yeni linkle güncellemeniz gerekir.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRegenerateDialogOpen(false)}>
              Vazgeç
            </Button>
            <Button onClick={handleRegenerateToken} disabled={isRegenerating}>
              {isRegenerating ? 'Yenileniyor…' : 'Evet, Yenile'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  )
}

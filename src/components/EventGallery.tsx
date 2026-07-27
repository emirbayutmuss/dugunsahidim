import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Download, ImageOff, Loader2, PlayCircle, X, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  createSignedDownloadUrl,
  createSignedUrlMap,
  downloadEventZip,
  fetchReadyUploads,
  setUploadModerationStatus,
} from '@/lib/gallery'
import type { UploadRow } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Pressable } from '@/components/Pressable'

interface EventGalleryProps {
  eventId: string
  eventName: string
}

// ASCII-only: this ends up in a Content-Disposition header (via Storage's
// `download` query param) — non-Latin1 characters make that header invalid.
function sanitizeFileNamePart(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60)
}

const MODERATION_BADGE: Record<'pending' | 'rejected', { label: string; className: string }> = {
  pending: { label: 'Onay Bekliyor', className: 'bg-amber-500 text-white' },
  rejected: { label: 'Reddedildi', className: 'bg-destructive text-white' },
}

export function EventGallery({ eventId, eventName }: EventGalleryProps) {
  const [uploads, setUploads] = useState<UploadRow[]>([])
  const [urlMap, setUrlMap] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState<UploadRow | null>(null)
  const [isZipping, setIsZipping] = useState(false)
  const [moderatingId, setModeratingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const rows = await fetchReadyUploads(eventId)
        if (cancelled) return
        setUploads(rows)

        const map = await createSignedUrlMap(rows.map((row) => row.file_path))
        if (cancelled) return
        setUrlMap(map)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Galeri yüklenemedi'
        toast.error(message)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [eventId])

  async function handleZipDownload() {
    setIsZipping(true)
    try {
      await downloadEventZip(eventId, eventName)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Toplu indirme başarısız oldu'
      toast.error(message)
    } finally {
      setIsZipping(false)
    }
  }

  async function handleSingleDownload(upload: UploadRow) {
    try {
      const extension = upload.file_path.split('.').pop() ?? 'bin'
      const fileName = `${sanitizeFileNamePart(upload.guest_name ?? 'misafir')}.${extension}`
      const url = await createSignedDownloadUrl(upload.file_path, fileName)
      window.location.href = url
    } catch {
      toast.error('İndirme başarısız oldu')
    }
  }

  async function handleModeration(upload: UploadRow, status: 'approved' | 'rejected') {
    const previousStatus = upload.moderation_status
    setModeratingId(upload.id)
    setUploads((rows) =>
      rows.map((row) => (row.id === upload.id ? { ...row, moderation_status: status } : row)),
    )
    setSelected((current) =>
      current && current.id === upload.id ? { ...current, moderation_status: status } : current,
    )

    try {
      await setUploadModerationStatus(upload.id, status)
      toast.success(status === 'approved' ? 'Onaylandı' : 'Reddedildi')
    } catch (error: unknown) {
      setUploads((rows) =>
        rows.map((row) =>
          row.id === upload.id ? { ...row, moderation_status: previousStatus } : row,
        ),
      )
      setSelected((current) =>
        current && current.id === upload.id ? { ...current, moderation_status: previousStatus } : current,
      )
      const message = error instanceof Error ? error.message : 'İşlem başarısız oldu'
      toast.error(message)
    } finally {
      setModeratingId(null)
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Galeri yükleniyor…</p>
  }

  if (uploads.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Henüz yüklenen fotoğraf/video yok. Misafirler QR kodu okutunca burada görünecek.
      </p>
    )
  }

  const pendingCount = uploads.filter((upload) => upload.moderation_status === 'pending').length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {uploads.length} anı
          {pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-600">
              {pendingCount} onay bekliyor
            </span>
          )}
        </p>
        <Pressable>
          <Button variant="outline" onClick={handleZipDownload} disabled={isZipping}>
            {isZipping ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Hazırlanıyor…
              </>
            ) : (
              <>
                <Download className="size-4" /> Tümünü İndir (ZIP)
              </>
            )}
          </Button>
        </Pressable>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {uploads.map((upload, index) => {
          const url = urlMap[upload.file_path]
          return (
            <motion.button
              key={upload.id}
              type="button"
              onClick={() => setSelected(upload)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4), ease: 'easeOut' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative aspect-square overflow-hidden rounded-lg bg-muted shadow-sm"
            >
              {upload.moderation_status !== 'approved' && (
                <span
                  className={`absolute top-1.5 left-1.5 z-10 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${MODERATION_BADGE[upload.moderation_status].className}`}
                >
                  {MODERATION_BADGE[upload.moderation_status].label}
                </span>
              )}
              {upload.file_type === 'image' && url ? (
                <img src={url} alt="" className="size-full object-cover" />
              ) : upload.file_type === 'video' ? (
                <div className="flex size-full flex-col items-center justify-center gap-1 text-muted-foreground">
                  <PlayCircle className="size-8" />
                  <span className="text-xs">Video</span>
                </div>
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImageOff className="size-6" />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[85vh] max-w-2xl overflow-hidden rounded-xl bg-card shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                aria-label="Kapat"
              >
                <X className="size-4" />
              </button>

              {selected.file_type === 'image' ? (
                <img
                  src={urlMap[selected.file_path]}
                  alt=""
                  className="max-h-[75vh] w-full object-contain"
                />
              ) : (
                <video
                  src={urlMap[selected.file_path]}
                  controls
                  autoPlay
                  className="max-h-[75vh] w-full"
                />
              )}

              <div className="flex items-center justify-between gap-3 p-3">
                <p className="min-w-0 truncate text-sm text-muted-foreground">
                  {selected.guest_name ?? 'İsimsiz misafir'}
                </p>
                <div className="flex shrink-0 items-center gap-3">
                  {selected.moderation_status !== 'approved' && (
                    <button
                      type="button"
                      disabled={moderatingId === selected.id}
                      onClick={() => handleModeration(selected, 'approved')}
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:underline disabled:opacity-50"
                    >
                      <CheckCircle2 className="size-4" /> Onayla
                    </button>
                  )}
                  {selected.moderation_status !== 'rejected' && (
                    <button
                      type="button"
                      disabled={moderatingId === selected.id}
                      onClick={() => handleModeration(selected, 'rejected')}
                      className="inline-flex items-center gap-1.5 text-sm text-destructive hover:underline disabled:opacity-50"
                    >
                      <XCircle className="size-4" /> Reddet
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSingleDownload(selected)}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Download className="size-4" /> İndir
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

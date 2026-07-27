import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { fetchLiveWall, type LiveWallData } from '@/lib/liveWall'
import { AuroraBackground } from '@/components/AuroraBackground'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const REFRESH_INTERVAL_MS = 25_000
const SLIDE_INTERVAL_MS = 6_000

export function LiveWallPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<LiveWallData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentIndexRef = useRef(0)
  currentIndexRef.current = currentIndex

  useDocumentMeta({
    title: data ? `${data.eventName} - Canlı Duvar` : 'Canlı Duvar - Düğün Şahidim',
    description: 'Misafirlerin paylaştığı anılar canlı olarak burada akıyor.',
  })

  useEffect(() => {
    if (!token) return
    let cancelled = false

    async function load() {
      const result = await fetchLiveWall(token!)
      if (cancelled) return

      if (!result) {
        setNotFound(true)
        setIsLoading(false)
        return
      }

      setData((previous) => {
        if (previous) {
          const currentPhotoId = previous.photos[currentIndexRef.current]?.id
          const preservedIndex = result.photos.findIndex((photo) => photo.id === currentPhotoId)
          setCurrentIndex(preservedIndex >= 0 ? preservedIndex : 0)
        }
        return result
      })
      setIsLoading(false)
    }

    load()
    const refreshTimer = setInterval(load, REFRESH_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(refreshTimer)
    }
  }, [token])

  useEffect(() => {
    if (!data || data.photos.length < 2) return

    const slideTimer = setInterval(() => {
      setCurrentIndex((index) => (index + 1) % data.photos.length)
    }, SLIDE_INTERVAL_MS)

    return () => clearInterval(slideTimer)
  }, [data])

  if (isLoading) {
    return <div className="min-h-dvh bg-black" />
  }

  if (notFound || !data) {
    return (
      <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-background px-4 text-center">
        <AuroraBackground />
        <p className="relative z-10 text-lg text-foreground">Bu duvar bulunamadı.</p>
      </div>
    )
  }

  if (data.photos.length === 0) {
    return (
      <div className="relative flex min-h-dvh flex-col items-center justify-center gap-3 overflow-hidden bg-background px-4 text-center">
        <AuroraBackground />
        <Heart className="relative z-10 size-8 fill-accent text-accent" />
        <h1 className="font-heading relative z-10 text-3xl font-bold text-primary">
          {data.eventName}
        </h1>
        <p className="relative z-10 text-muted-foreground">İlk anı yakında burada 💛</p>
      </div>
    )
  }

  const currentPhoto = data.photos[currentIndex]

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        <motion.img
          key={currentPhoto.id}
          src={currentPhoto.url}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 size-full object-contain"
        />
      </AnimatePresence>
      <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-sm text-white/60">
        {data.eventName} · Düğün Şahidim
      </p>
    </div>
  )
}

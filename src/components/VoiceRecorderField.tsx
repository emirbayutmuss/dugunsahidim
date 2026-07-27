import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Mic, RotateCcw, Square } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

const MAX_DURATION_MS = 60_000
const NEAR_LIMIT_MS = 55_000
const CANDIDATE_MIME_TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4']

type RecorderStatus = 'idle' | 'recording' | 'recorded'

interface VoiceRecorderFieldProps {
  onRecordingChange: (file: File | null) => void
  disabled?: boolean
}

function pickSupportedMimeType(): string | null {
  if (typeof MediaRecorder === 'undefined') return null
  return CANDIDATE_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? null
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function VoiceRecorderField({ onRecordingChange, disabled }: VoiceRecorderFieldProps) {
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  function stopStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  function stopRecording() {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    mediaRecorderRef.current?.stop()
  }

  async function startRecording() {
    const mimeType = pickSupportedMimeType()
    if (!mimeType) {
      toast.error('Tarayıcınız ses kaydını desteklemiyor.')
      return
    }

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      toast.error('Mikrofon erişimi sağlanamadı, lütfen tarayıcı izinlerini kontrol edin.')
      return
    }

    streamRef.current = stream
    chunksRef.current = []
    const recorder = new MediaRecorder(stream, { mimeType })
    mediaRecorderRef.current = recorder

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data)
    }

    recorder.onstop = () => {
      stopStream()
      const baseMimeType = mimeType.split(';')[0]
      const extension = baseMimeType === 'audio/mp4' ? 'm4a' : 'webm'
      const blob = new Blob(chunksRef.current, { type: baseMimeType })
      const file = new File([blob], `ses-mesaji.${extension}`, { type: baseMimeType })

      setPreviewUrl(URL.createObjectURL(blob))
      setStatus('recorded')
      onRecordingChange(file)
    }

    recorder.start()
    startTimeRef.current = Date.now()
    setElapsedMs(0)
    setStatus('recording')

    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      setElapsedMs(elapsed)
      if (elapsed >= MAX_DURATION_MS) {
        stopRecording()
      }
    }, 200)
  }

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setElapsedMs(0)
    setStatus('idle')
    onRecordingChange(null)
  }

  if (status === 'recorded' && previewUrl) {
    return (
      <div className="space-y-3 rounded-xl border border-border p-4">
        <audio src={previewUrl} controls className="w-full" />
        <Button type="button" variant="outline" onClick={reset} disabled={disabled}>
          <RotateCcw className="size-4" /> Tekrar Kaydet
        </Button>
      </div>
    )
  }

  const isNearLimit = elapsedMs >= NEAR_LIMIT_MS

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-8 text-center">
      <motion.button
        type="button"
        onClick={status === 'recording' ? stopRecording : startRecording}
        disabled={disabled}
        animate={status === 'recording' ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{
          duration: 1,
          repeat: status === 'recording' ? Infinity : 0,
          ease: 'easeInOut',
        }}
        className={`flex size-16 items-center justify-center rounded-full text-white ${
          status === 'recording' ? 'bg-destructive' : 'bg-primary'
        }`}
      >
        {status === 'recording' ? <Square className="size-6" /> : <Mic className="size-6" />}
      </motion.button>
      <p className="text-sm text-foreground">
        {status === 'recording'
          ? 'Kaydediliyor… (durdurmak için dokun)'
          : 'Sesli mesaj bırakmak için dokun'}
      </p>
      {status === 'recording' && (
        <p className={`font-heading text-xl ${isNearLimit ? 'text-destructive' : 'text-primary'}`}>
          {formatDuration(elapsedMs)} / 1:00
        </p>
      )}
    </div>
  )
}

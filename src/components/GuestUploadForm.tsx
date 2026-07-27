import { type ChangeEvent, type DragEvent, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ImagePlus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { uploadGuestMedia, validateFileClientSide } from '@/lib/upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { VoiceRecorderField } from '@/components/VoiceRecorderField'

const ACCEPTED_MIME_TYPES =
  'image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm'

type UploadStatus = 'idle' | 'uploading' | 'success'
type UploadMode = 'media' | 'audio'

interface GuestUploadFormProps {
  slug: string
}

function formatFileSize(bytes: number): string {
  const megabytes = bytes / (1024 * 1024)
  return `${megabytes.toFixed(1)} MB`
}

export function GuestUploadForm({ slug }: GuestUploadFormProps) {
  const [mode, setMode] = useState<UploadMode>('media')
  const [guestName, setGuestName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [hasConsented, setHasConsented] = useState(false)
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const activeFile = mode === 'media' ? file : audioFile

  function switchMode(nextMode: UploadMode) {
    if (nextMode === mode || status === 'uploading') return
    setMode(nextMode)
    clearFile()
    setAudioFile(null)
  }

  function selectFile(candidate: File | undefined) {
    if (!candidate) return

    const validationError = validateFileClientSide(candidate)
    if (validationError) {
      toast.error(validationError)
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)

    setFile(candidate)
    setPreviewUrl(candidate.type.startsWith('image/') ? URL.createObjectURL(candidate) : null)
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0])
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragActive(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  function clearFile() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit() {
    if (!activeFile || !hasConsented) return

    setStatus('uploading')
    try {
      await uploadGuestMedia(slug, activeFile, guestName.trim() || null)
      setStatus('success')
      clearFile()
      setAudioFile(null)
      setGuestName('')
      setHasConsented(false)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Yükleme başarısız oldu'
      toast.error(message)
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 py-2 text-center"
      >
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
          className="flex justify-center"
        >
          <CheckCircle2 className="size-12 text-primary" strokeWidth={1.5} />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="text-foreground"
        >
          Teşekkürler! Anınız başarıyla yüklendi. 💛
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="inline-block"
        >
          <Button variant="outline" onClick={() => setStatus('idle')}>
            Başka bir tane yükle
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4 text-left">
      <div className="space-y-2">
        <Label htmlFor="guest-name">Adınız (opsiyonel)</Label>
        <Input
          id="guest-name"
          placeholder="Örn. Elif"
          value={guestName}
          onChange={(event) => setGuestName(event.target.value)}
          disabled={status === 'uploading'}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => switchMode('media')}
          disabled={status === 'uploading'}
          className={`rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === 'media' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
          }`}
        >
          Fotoğraf/Video
        </button>
        <button
          type="button"
          onClick={() => switchMode('audio')}
          disabled={status === 'uploading'}
          className={`rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === 'audio' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
          }`}
        >
          Sesli Mesaj
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_MIME_TYPES}
        className="hidden"
        onChange={handleInputChange}
        disabled={status === 'uploading'}
      />

      {mode === 'audio' ? (
        <VoiceRecorderField onRecordingChange={setAudioFile} disabled={status === 'uploading'} />
      ) : (
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => event.key === 'Enter' && fileInputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragActive(true)
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragActive ? 'border-primary bg-secondary/50' : 'border-border hover:bg-muted/50'
            }`}
          >
            <ImagePlus className="size-8 text-muted-foreground" />
            <p className="text-sm text-foreground">Fotoğraf ya da video seçin</p>
            <p className="text-xs text-muted-foreground">veya buraya sürükleyip bırakın</p>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex items-center gap-3 rounded-xl border border-border p-3"
          >
            {previewUrl ? (
              <img src={previewUrl} alt="" className="size-16 rounded-lg object-cover" />
            ) : (
              <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                Video
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            {status !== 'uploading' && (
              <button
                type="button"
                onClick={clearFile}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Kaldır"
              >
                <X className="size-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      )}

      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={hasConsented}
          onChange={(event) => setHasConsented(event.target.checked)}
          disabled={status === 'uploading'}
          className="mt-0.5 size-4 shrink-0 accent-primary"
        />
        <span>
          Yüklediğim fotoğraf/video/ses kaydının etkinlik sahibi tarafından görüntülenmesine ve
          indirilmesine izin veriyorum. (KVKK kapsamında kişisel veri işleme onayı)
        </span>
      </label>

      {status === 'uploading' && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full w-1/3 rounded-full bg-primary"
            animate={{ x: ['-100%', '250%'] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      )}

      <motion.div
        whileHover={activeFile && hasConsented && status !== 'uploading' ? { scale: 1.02 } : undefined}
        whileTap={activeFile && hasConsented && status !== 'uploading' ? { scale: 0.98 } : undefined}
      >
        <Button
          className="w-full"
          disabled={!activeFile || !hasConsented || status === 'uploading'}
          onClick={handleSubmit}
        >
          {status === 'uploading' ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Yükleniyor…
            </>
          ) : (
            'Yükle'
          )}
        </Button>
      </motion.div>
    </div>
  )
}

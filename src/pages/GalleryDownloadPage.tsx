import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Download, Loader2, XCircle } from 'lucide-react'
import { downloadGalleryZipByToken } from '@/lib/gallery'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SiteHeader } from '@/components/SiteHeader'
import { PageTransition } from '@/components/PageTransition'
import { Pressable } from '@/components/Pressable'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

type Status = 'loading' | 'success' | 'error'

export function GalleryDownloadPage() {
  const { token } = useParams<{ token: string }>()
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useDocumentMeta({
    title: 'Galeri İndiriliyor - Düğün Şahidim',
    description: 'E-postanıza gönderilen bağlantı üzerinden galerinizin ZIP dosyasını indirin.',
  })

  async function attemptDownload() {
    if (!token) return
    setStatus('loading')
    try {
      await downloadGalleryZipByToken(token)
      setStatus('success')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Zip dosyası oluşturulamadı'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  useEffect(() => {
    attemptDownload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <PageTransition className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="border-border/60 shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-primary">
                Galeri İndirme
              </h1>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 text-center">
              {status === 'loading' && (
                <>
                  <Loader2 className="size-8 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Zip dosyası hazırlanıyor…</p>
                </>
              )}

              {status === 'success' && (
                <>
                  <CheckCircle2 className="size-8 text-emerald-600" />
                  <p className="text-sm text-foreground">
                    İndirme başladı. Başlamadıysa aşağıdaki butona tıklayın.
                  </p>
                  <Pressable>
                    <Button onClick={attemptDownload}>
                      <Download className="size-4" /> Tekrar İndir
                    </Button>
                  </Pressable>
                  <p className="text-xs text-muted-foreground">Bu bağlantı 48 saat geçerlidir.</p>
                </>
              )}

              {status === 'error' && (
                <>
                  <XCircle className="size-8 text-destructive" />
                  <p className="text-sm text-foreground">{errorMessage}</p>
                  <p className="text-xs text-muted-foreground">
                    Panelinize giriş yapıp galeriden tekrar bir bağlantı isteyebilirsiniz.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}

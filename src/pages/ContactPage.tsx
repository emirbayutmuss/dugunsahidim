import { type FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { SiteHeader } from '@/components/SiteHeader'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageTransition } from '@/components/PageTransition'
import { Pressable } from '@/components/Pressable'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { submitContactMessage } from '@/lib/contact'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

type FormStatus = 'idle' | 'submitting' | 'success'

export function ContactPage() {
  useDocumentMeta({
    title: 'İletişim - Düğün Şahidim',
    description:
      'Sorularınız, önerileriniz ya da geri bildiriminiz mi var? Düğün Şahidim ekibiyle doğrudan iletişime geçin, size en kısa sürede geri dönüş yapalım.',
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage(null)

    try {
      await submitContactMessage({ name, email, message, honeypot })
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Bir şeyler ters gitti')
      setStatus('idle')
    }
  }

  return (
    <PageTransition className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-lg px-6 py-10">
        <Breadcrumb items={[{ label: 'İletişim' }]} />

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl">İletişim</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sorunuz, öneriniz ya da geri bildiriminiz mi var? Aşağıdaki formu doldurun, size
            döneceğiz. Doğrudan yazmayı tercih ederseniz:{' '}
            <a href="mailto:merhaba@dugunsahidim.com" className="text-foreground hover:underline">
              merhaba@dugunsahidim.com
            </a>
            .
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Sosyal medya hesaplarımız yakında burada olacak.
          </p>

          <Card className="mt-6">
            <CardContent className="pt-6">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3 py-6 text-center"
                >
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                    className="flex justify-center"
                  >
                    <CheckCircle2 className="size-10 text-primary" strokeWidth={1.5} />
                  </motion.div>
                  <p className="text-foreground">Mesajınız iletildi, teşekkürler!</p>
                  <Pressable>
                    <Button variant="outline" onClick={() => setStatus('idle')}>
                      Yeni mesaj gönder
                    </Button>
                  </Pressable>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Adınız</Label>
                    <Input
                      id="contact-name"
                      required
                      maxLength={120}
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      disabled={status === 'submitting'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">E-posta</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      maxLength={254}
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      disabled={status === 'submitting'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Mesajınız</Label>
                    <textarea
                      id="contact-message"
                      required
                      rows={5}
                      maxLength={2000}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      disabled={status === 'submitting'}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </div>

                  {/* Honeypot: gerçek kullanıcılar bu alanı görmez/doldurmaz */}
                  <div className="hidden" aria-hidden="true">
                    <Label htmlFor="contact-website">Web siteniz</Label>
                    <Input
                      id="contact-website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(event) => setHoneypot(event.target.value)}
                    />
                  </div>

                  <Pressable className="block w-full">
                    <Button type="submit" className="w-full" disabled={status === 'submitting'}>
                      {status === 'submitting' ? 'Gönderiliyor…' : 'Gönder'}
                    </Button>
                  </Pressable>

                  {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  )
}

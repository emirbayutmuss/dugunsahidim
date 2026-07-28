import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mic, QrCode, Smile } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuroraBackground } from '@/components/AuroraBackground'
import { SiteHeader } from '@/components/SiteHeader'
import { Footer } from '@/components/Footer'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageTransition } from '@/components/PageTransition'
import { Pressable } from '@/components/Pressable'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const STEPS = [
  {
    icon: QrCode,
    title: 'Misafir QR kodu okutur',
    description: 'Aynı QR koddan fotoğraf/video yükleme ekranına gelen misafiriniz, sesli mesaj seçeneğini de görür.',
  },
  {
    icon: Mic,
    title: 'Tek dokunuşla kayıt başlar',
    description: 'Uygulama indirmeden, kayıt olmadan — tarayıcıdan doğrudan mikrofona konuşup dileklerini bırakır.',
  },
  {
    icon: Smile,
    title: 'Siz dinleyip saklarsınız',
    description: 'Tüm sesli mesajlar galerinizde diğer anılarla birlikte listelenir, istediğiniz zaman dinleyip indirebilirsiniz.',
  },
]

export function SesliMisafirDefteriPage() {
  useDocumentMeta({
    title: "Sesli Misafir Defteri - Düğününüze Sesli Dilek Mesajları | Düğün Şahidim",
    description:
      'Misafirlerinizin kağıda yazmak yerine kendi sesleriyle bıraktığı dilek mesajlarını toplayın. Uygulama indirmeden, QR kod okutup tek dokunuşla kayıt — Düğün Şahidim\'e özel Sesli Misafir Defteri.',
  })

  return (
    <PageTransition className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-6 pt-10 pb-20">
        <AuroraBackground />
        <div className="relative z-10 mx-auto max-w-3xl">
          <Breadcrumb items={[{ label: 'Sesli Misafir Defteri' }]} />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-xs font-semibold tracking-[0.2em] text-rose uppercase"
          >
            Sadece Düğün Şahidim'de
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 font-heading text-4xl leading-[1.1] font-bold tracking-tight text-primary sm:text-6xl"
          >
            Sesli Misafir Defteri: Dilekler Kağıda Değil, Kendi Sesleriyle Kalsın
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            Klasik misafir defterindeki el yazısı yerine, misafirleriniz kendi sesleriyle
            kısa bir dilek bırakabilir. Yıllar sonra o günü sadece fotoğraflarla değil,
            sevdiklerinizin gerçek sesiyle hatırlayın.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Pressable>
              <Link to="/login" className={buttonVariants({ size: 'lg' })}>
                Ücretsiz Dene
              </Link>
            </Pressable>
            <Pressable>
              <Link to="/" className={buttonVariants({ size: 'lg', variant: 'ghost' })}>
                Diğer Özellikleri Gör
              </Link>
            </Pressable>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-3">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Nedir?
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Sesli Misafir Defteri, aynı QR kod üzerinden misafirlerinizin fotoğraf/video
            yanında, tarayıcı üzerinden doğrudan mikrofona kaydettiği kısa (en fazla 1
            dakika) sesli mesajları toplayan bir özelliktir. Kayıtlar galerinizde diğer
            anılarla birlikte listelenir; onaylayıp dinleyebilir, tümünü ZIP olarak
            indirebilir ya da tek tek e-postanıza gönderebilirsiniz.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Nasıl Çalışır
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.12 }}
                className="flex flex-col items-center text-center"
              >
                <div className="flex size-12 items-center justify-center rounded-full border-2 border-primary bg-background text-primary">
                  <step.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <Card className="border-border/60">
            <CardContent className="space-y-3 py-8">
              <h2 className="flex items-center gap-2 font-heading text-xl font-semibold text-foreground">
                <Mic className="size-5 text-primary" /> Neden kağıt misafir defterinden daha iyi?
              </h2>
              <p className="text-sm text-muted-foreground">
                Kağıt defterler kaybolabilir, okunması zor olabilir ve o anın tonunu,
                heyecanını taşımaz. Sesli mesajlar; gülüşü, duygu titremesini ve söylenen
                her kelimeyi olduğu gibi saklar. Ayrıca misafirleriniz için de daha
                pratiktir — kalem aramaya veya sırasını beklemeye gerek kalmadan, telefon
                kamerasıyla QR kodu okutup 1 dakikada dileklerini bırakabilirler.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <Heart className="mx-auto size-6 fill-accent text-accent" />
          <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Düğününüzde deneyin
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Sesli Misafir Defteri, Düğün Şahidim'in ücretsiz denenebilen tüm
            özellikleriyle birlikte gelir.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Pressable>
              <Link to="/login" className={buttonVariants({ size: 'lg' })}>
                Ücretsiz Dene
              </Link>
            </Pressable>
          </div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  )
}

import { motion } from 'framer-motion'
import { Gift, Handshake, Rocket, Users } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuroraBackground } from '@/components/AuroraBackground'
import { SiteHeader } from '@/components/SiteHeader'
import { Footer } from '@/components/Footer'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageTransition } from '@/components/PageTransition'
import { Pressable } from '@/components/Pressable'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const BENEFITS = [
  {
    icon: Users,
    title: 'Misafir memnuniyeti',
    description: 'Organize ettiğiniz her düğünde çiftlere ve misafirlere sunabileceğiniz, fark yaratan bir hizmet.',
  },
  {
    icon: Gift,
    title: 'Ekstra gelir fırsatı',
    description: 'Paketinize dahil edin ya da komisyonlu bir ek hizmet olarak sunun — size uyan modeli birlikte belirleyelim.',
  },
  {
    icon: Rocket,
    title: 'Kolay kurulum',
    description: 'Teknik bir ekibe ihtiyaç yok. Her etkinlik için birkaç saniyede QR kod oluşturup masalara yerleştirmeniz yeterli.',
  },
]

const MAILTO_HREF =
  'mailto:merhaba@dugunsahidim.com?subject=Kurumsal%20i%C5%9Fbirli%C4%9Fi'

export function CorporatePage() {
  useDocumentMeta({
    title: 'Kurumsal - Düğün Organizatörleri ve Salonlar için | Düğün Şahidim',
    description:
      'Düğün organizatörü ya da salon sahibi misiniz? Her etkinliğinize Düğün Şahidim\'i dahil ederek misafir memnuniyetini artırın, ekstra gelir fırsatı yakalayın. Bizimle görüşün.',
  })

  return (
    <PageTransition className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-6 pt-10 pb-20">
        <AuroraBackground />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Breadcrumb items={[{ label: 'Kurumsal' }]} />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-4 text-xs font-semibold tracking-[0.2em] text-rose uppercase"
          >
            Organizatörler & Salonlar için
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 font-heading text-4xl leading-[1.1] font-bold tracking-tight text-primary sm:text-6xl"
          >
            Düğün Organizatörü ya da Salon musunuz?
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            Yönettiğiniz her düğüne Düğün Şahidim'i dahil ederek fark yaratın. Çiftlere ve
            misafirlerine sunduğunuz deneyimi bir adım öteye taşırken, işletmeniz için de
            yeni bir gelir kapısı açın.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Pressable>
              <a href={MAILTO_HREF} className={buttonVariants({ size: 'lg' })}>
                <Handshake className="size-4" /> Bizimle Görüşün
              </a>
            </Pressable>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Neden Düğün Şahidim'i Dahil Etmelisiniz?
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/60">
                  <CardContent className="flex h-full flex-col items-center gap-2 py-8 text-center">
                    <benefit.icon className="size-6 text-primary" />
                    <h3 className="font-heading text-lg font-semibold text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Konuşalım
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Kaç etkinlik yönettiğinizi, hangi modelin sizin için uygun olacağını birlikte
            konuşalım. Aşağıdaki adresten bize yazmanız yeterli, size en kısa sürede geri
            dönüş yapalım.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Pressable>
              <a href={MAILTO_HREF} className={buttonVariants({ size: 'lg' })}>
                <Handshake className="size-4" /> merhaba@dugunsahidim.com
              </a>
            </Pressable>
          </div>
        </div>
      </section>

      <Footer />
    </PageTransition>
  )
}

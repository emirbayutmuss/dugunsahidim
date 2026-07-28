import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Cast, Heart, QrCode, RefreshCw, Tv } from 'lucide-react'
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
    title: 'Canlı Duvarı etkinleştirin',
    description: 'Panelinizden tek tıkla Canlı Duvarı açın, size özel ve tahmin edilemez bir link oluşturulsun.',
  },
  {
    icon: Cast,
    title: 'TV veya projeksiyona bağlayın',
    description: 'Linki mekandaki TV\'nin veya projeksiyonun tarayıcısında açın — herhangi bir uygulama veya kablo gerekmez.',
  },
  {
    icon: RefreshCw,
    title: 'Anlar otomatik akmaya başlasın',
    description: 'Misafirleriniz QR kodu okutup fotoğraf yükledikçe, onayladığınız kareler duvarda otomatik olarak sırayla belirir.',
  },
]

export function CanliFotografDuvariPage() {
  useDocumentMeta({
    title: 'Canlı Fotoğraf Duvarı - Düğününüzde TV\'de Anlık Slayt | Düğün Şahidim',
    description:
      'Düğün mekanınızdaki TV veya projeksiyona bağlanan, misafirlerin yüklediği fotoğrafları otomatik slayt olarak gösteren Canlı Fotoğraf Duvarı özelliğini keşfedin. Kurulum gerekmez, saniyeler içinde çalışır.',
  })

  return (
    <PageTransition className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-6 pt-10 pb-20">
        <AuroraBackground />
        <div className="relative z-10 mx-auto max-w-3xl">
          <Breadcrumb items={[{ label: 'Canlı Fotoğraf Duvarı' }]} />

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
            Canlı Fotoğraf Duvarı: Misafirlerinizin Anları Düğün Boyunca TV'de Aksın
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg"
          >
            Mekandaki bir TV'ye veya projeksiyona bağlayabileceğiniz özel bir link
            oluşturun — misafirlerin yüklediği onaylı fotoğraflar, gece boyunca otomatik
            olarak slayt gösterisi şeklinde akmaya devam etsin. Ekstra bir cihaz, uygulama
            veya teknik ekip gerekmez.
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
            Canlı Fotoğraf Duvarı, misafirlerinizin QR kod üzerinden yüklediği ve sizin
            onayladığınız fotoğrafları, düğün mekanınızdaki bir ekranda otomatik olarak
            döngü halinde gösteren bir slayt gösterisidir. Davetliler yüklemeye devam
            ettikçe duvar da kendini tazeler — gece boyunca en taze anlar sürekli akışta
            kalır.
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
                <Tv className="size-5 text-primary" /> Mekanda TV veya projeksiyona nasıl bağlanır?
              </h2>
              <p className="text-sm text-muted-foreground">
                Canlı Duvar linki, herhangi bir tarayıcıda açılabilen normal bir web
                sayfasıdır. Mekandaki TV'nin akıllı tarayıcısında, HDMI ile bağlı bir
                dizüstü bilgisayarda ya da bir projeksiyon cihazında linki açmanız yeterli
                — otomatik olarak tam ekran slayt moduna geçer ve kendini periyodik olarak
                tazeler. Güvenlik amacıyla linki istediğiniz zaman panelinizden yenileyip
                eski bağlantıyı geçersiz kılabilirsiniz.
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
            Canlı Fotoğraf Duvarı, Düğün Şahidim'in ücretsiz denenebilen tüm
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

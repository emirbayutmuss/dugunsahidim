import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Camera, QrCode, ShieldCheck, Sparkles, Table2, Zap } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuroraBackground } from '@/components/AuroraBackground'
import { TextReveal } from '@/components/TextReveal'
import { SiteHeader } from '@/components/SiteHeader'
import firstDance from '@/assets/gallery/first-dance.jpg'
import receptionDance from '@/assets/gallery/reception-dance.jpg'
import guestsToast from '@/assets/gallery/guests-toast.jpg'
import kissCheer from '@/assets/gallery/kiss-cheer.jpg'
import ringsExchange from '@/assets/gallery/rings-exchange.jpg'
import groupCandid from '@/assets/gallery/group-candid.jpg'

/**
 * Örnek galeri görselleri — gerçek müşteri fotoğrafı DEĞİL, Unsplash Lisansı ile
 * ücretsiz kullanılabilir, samimi/docu-editorial tarzda stok fotoğraflar (poz
 * verilmiş stüdyo çekimi değil). Yerel olarak indirilip src/assets/gallery/
 * altında saklanıyor — harici CDN'e bağımlılığı ve olası engellenmeyi önlemek
 * için ("Misafirleriniz anları böyle paylaşacak" hissini vermek amacıyla).
 * Krediler (atıf gerekmiyor ama iyi pratik): Bryan Jesus De Los Santos Breton,
 * Fotógrafo Samuel Cruz (x2), Al Elmes, Camila Cordeiro, 150 Billi — unsplash.com.
 */
const SAMPLE_GALLERY = [
  { src: firstDance, alt: 'Gelin ve damadın ilk dansı' },
  { src: receptionDance, alt: 'Düğün pistinde dans eden çift' },
  { src: guestsToast, alt: 'Misafirlerin kadeh kaldırdığı an' },
  { src: kissCheer, alt: 'Gelin damat öperken tezahürat eden misafirler' },
  { src: ringsExchange, alt: 'Alyans takma anı' },
  { src: groupCandid, alt: 'Gülümseyen misafir grubu' },
]

const STEPS = [
  {
    icon: QrCode,
    title: 'Etkinlik oluştur, QR kodunu al',
    description: 'Birkaç saniyede etkinliğini oluştur, sana özel benzersiz QR kodun hazır olsun.',
  },
  {
    icon: Table2,
    title: 'Masalara yerleştir',
    description: 'QR kodu bastır, düğün masalarına ya da davetiye kartlarına yerleştir.',
  },
  {
    icon: Camera,
    title: 'Misafirler tarasın, anılar toplansın',
    description: 'Misafirlerin uygulama indirmeden, giriş yapmadan fotoğraf ve video yüklesin.',
  },
]

const FEATURES = [
  {
    icon: Zap,
    title: 'Hızlı',
    description: 'QR kodu okutmak ve yüklemek saniyeler sürer — hiçbir kurulum gerekmez.',
  },
  {
    icon: ShieldCheck,
    title: 'Güvenli & KVKK Uyumlu',
    description: 'Misafir onayı, güvenli dosya doğrulama ve kişisel veri koruması en baştan tasarlandı.',
  },
  {
    icon: Sparkles,
    title: 'Kolay Kullanım',
    description: 'Sen ve misafirlerin için sade, zarif ve kafa karıştırmayan bir deneyim.',
  },
]

function FadeInSection({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-6 pt-6 pb-28 sm:pt-10">
        <AuroraBackground />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-medium tracking-widest text-accent-foreground uppercase"
          >
            Düğün & Etkinlik Anı Toplama
          </motion.p>

          <h1 className="mt-5 font-heading text-5xl leading-[1.05] font-medium tracking-tight text-primary sm:text-6xl md:text-7xl">
            <TextReveal text="Düğününüzün Her Anı, Tek Bir Yerde Toplansın" delayStart={0.15} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Misafirleriniz uygulama indirmeden, giriş yapmadan, sadece QR kodu okutarak
            fotoğraf ve video paylaşsın. Siz de tüm anıları tek bir galeride toplayın.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.05 }}
            className="mt-9 flex justify-center gap-3"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/login" className={buttonVariants({ size: 'lg' })}>
                Ücretsiz Dene
              </Link>
            </motion.div>
            <a href="#nasil-calisir" className={buttonVariants({ size: 'lg', variant: 'ghost' })}>
              Nasıl Çalışır?
            </a>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <FadeInSection>
            <h2 className="text-center font-heading text-2xl text-foreground sm:text-3xl">
              Misafirleriniz anları böyle paylaşacak
            </h2>
          </FadeInSection>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {SAMPLE_GALLERY.map((photo, index) => (
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ scale: 1.03 }}
                className={`overflow-hidden rounded-xl shadow-sm ${
                  index % 2 === 0 ? 'sm:mt-0' : 'sm:mt-6'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[3/4] size-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="nasil-calisir" className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <FadeInSection>
            <h2 className="text-center font-heading text-2xl text-foreground sm:text-3xl">
              Nasıl Çalışır
            </h2>
          </FadeInSection>
          <div className="relative mt-12 grid gap-10 sm:grid-cols-3 sm:gap-6">
            <div
              aria-hidden
              className="absolute top-6 right-[16.5%] left-[16.5%] hidden h-px bg-border sm:block"
            />
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex size-12 items-center justify-center rounded-full border-2 border-primary bg-background text-primary">
                  <step.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/60">
                  <CardContent className="flex h-full flex-col items-center gap-2 py-8 text-center">
                    <feature.icon className="size-6 text-primary" />
                    <h3 className="font-heading text-lg text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <FadeInSection className="mx-auto max-w-xl text-center">
          <p className="text-xs font-medium tracking-widest text-accent-foreground uppercase">
            Yakında
          </p>
          <h2 className="mt-3 font-heading text-2xl text-foreground sm:text-3xl">
            Fiyatlandırma
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Yeni başlıyoruz — fiyatlandırmamız henüz netleşmedi. Şimdilik ücretsiz deneyip
            bize geri bildirim verebilirsiniz.
          </p>
        </FadeInSection>
      </section>

      <footer className="border-t border-border/60 px-6 py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <span className="font-heading text-base text-primary">Düğün Şahidim</span>
          <div className="flex items-center gap-4">
            <Link to="/sss" className="hover:text-foreground hover:underline">
              SSS
            </Link>
            <Link to="/iletisim" className="hover:text-foreground hover:underline">
              İletişim
            </Link>
            <Link to="/gizlilik" className="hover:text-foreground hover:underline">
              Gizlilik
            </Link>
          </div>
          <p>
            Sorularınız için:{' '}
            <a href="mailto:merhaba@dugunsahidim.com" className="hover:text-foreground hover:underline">
              merhaba@dugunsahidim.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}

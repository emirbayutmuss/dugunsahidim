import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Camera,
  QrCode,
  ShieldCheck,
  Sparkles as SparklesIcon,
  Table2,
  Zap,
} from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AuroraBackground } from '@/components/AuroraBackground'
import { Sparkles } from '@/components/Sparkles'
import { TextReveal, getTextRevealDuration } from '@/components/TextReveal'
import { SiteHeader } from '@/components/SiteHeader'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const HERO_TITLE = 'Düğününüzün Her Anı, Tek Bir Yerde Toplansın'
const HERO_TITLE_START = 0.2
const HERO_WORD_DELAY = 0.18
const HERO_WORD_DURATION = 0.7

/**
 * Örnek galeri görselleri — gerçek müşteri fotoğrafı DEĞİL, Pexels Lisansı ile
 * ücretsiz kullanılabilir, samimi/candid tarzda stok fotoğraflar (poz verilmiş
 * stüdyo çekimi değil). Bir kere indirilip public/gallery/ altında saklanıyor
 * — canlı API'ye her sayfa yüklenişinde bağımlı olmamak ve hotlink kırılma
 * riskini önlemek için. Fotoğrafçı kredileri: Amar Preciado, Juliano Astc,
 * Alexander Mass, Tiarra Sorte — pexels.com (atıf gerekmiyor ama iyi pratik).
 */
const SAMPLE_GALLERY = [
  { src: '/gallery/wedding-reception.jpg', alt: 'Düğün resepsiyonunda misafirler', credit: 'Amar Preciado' },
  { src: '/gallery/wedding-dance.jpg', alt: 'Mutlu bir çiftin dans anı', credit: 'Juliano Astc' },
  { src: '/gallery/wedding-toast.jpg', alt: 'Misafirlerin kadeh kaldırdığı an', credit: 'Alexander Mass' },
  { src: '/gallery/wedding-rings.jpg', alt: 'Alyans takan çiftin elleri', credit: 'Tiarra Sorte' },
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
    icon: SparklesIcon,
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
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function HomePage() {
  useDocumentMeta({
    title: 'Düğün Şahidim - Düğün Anılarınızı QR Kod ile Toplayın',
    description:
      'Misafirleriniz uygulama indirmeden, giriş yapmadan QR kodu okutarak fotoğraf ve video yüklesin. Düğün ve etkinlik anılarınızı tek bir galeride güvenle toplayın.',
  })

  const shouldReduceMotion = useReducedMotion()

  const titleDuration = shouldReduceMotion
    ? 0
    : getTextRevealDuration(HERO_TITLE, {
        delayStart: HERO_TITLE_START,
        wordDelay: HERO_WORD_DELAY,
        wordDuration: HERO_WORD_DURATION,
      })
  const subheadingDelay = shouldReduceMotion ? 0 : titleDuration + 0.15
  const ctaDelay = shouldReduceMotion ? 0.1 : subheadingDelay + 0.3

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-6 pt-6 pb-28 sm:pt-10">
        <AuroraBackground />
        <Sparkles count={14} />
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
            <TextReveal
              text={HERO_TITLE}
              delayStart={HERO_TITLE_START}
              wordDelay={HERO_WORD_DELAY}
              wordDuration={HERO_WORD_DURATION}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: subheadingDelay }}
            className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Misafirleriniz uygulama indirmeden, giriş yapmadan, sadece QR kodu okutarak
            fotoğraf ve video paylaşsın. Siz de tüm anıları tek bir galeride toplayın.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: ctaDelay }}
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
        <div className="mx-auto max-w-4xl">
          <FadeInSection>
            <h2 className="text-center font-heading text-2xl text-foreground sm:text-3xl">
              Misafirleriniz anları böyle paylaşacak
            </h2>
          </FadeInSection>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5 }}
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {SAMPLE_GALLERY.map((photo) => (
              <motion.div
                key={photo.src}
                whileHover={{ scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl shadow-md"
              >
                {/* No loading="lazy" here: combined with the parent's scroll-triggered
                    opacity animation, native lazy-loading was never requesting the
                    image at all in some browsers — the images just silently never
                    loaded. Only 4 images in this section, so eager loading is cheap. */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={1200}
                  className="aspect-[4/5] w-full object-cover"
                />
                <span className="absolute right-3 bottom-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  Fotoğraf: {photo.credit} / Pexels
                </span>
              </motion.div>
            ))}
          </motion.div>
          <p className="mt-4 text-center text-xs text-muted-foreground">Fotoğraflar: Pexels</p>
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
                viewport={{ once: true, amount: 0.3 }}
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
          <FadeInSection>
            <h2 className="text-center font-heading text-2xl text-foreground sm:text-3xl">
              Öne Çıkan Özellikler
            </h2>
          </FadeInSection>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
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

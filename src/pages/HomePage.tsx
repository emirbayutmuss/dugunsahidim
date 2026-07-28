import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Camera,
  Cast,
  Mic,
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
import { Footer } from '@/components/Footer'
import { PageTransition } from '@/components/PageTransition'
import { Pressable } from '@/components/Pressable'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const TRUST_CHIPS = [
  { icon: ShieldCheck, label: 'KVKK Uyumlu' },
  { icon: Zap, label: 'Kurulum Gerekmez' },
  { icon: QrCode, label: 'Anında Paylaşım' },
]

const HERO_TITLE = 'O Günü, Sizin Görmediğiniz Gözlerden de Yaşayın'
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
  {
    icon: Cast,
    title: 'Canlı Fotoğraf Duvarı',
    description: 'Mekandaki TV veya projeksiyonda, onaylı anları gece boyunca otomatik slayt olarak akıtın.',
    to: '/canli-fotograf-duvari',
  },
  {
    icon: Mic,
    title: 'Sesli Misafir Defteri',
    description: 'Misafirleriniz kağıda değil, kendi sesleriyle 1 dakikalık dilek mesajı bıraksın.',
    to: '/sesli-misafir-defteri',
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
    <PageTransition className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative overflow-hidden px-6 pt-12 pb-32 sm:pt-20 sm:pb-40">
        <AuroraBackground />
        <Sparkles count={14} />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold tracking-[0.2em] text-rose uppercase"
          >
            Düğün & Etkinlik Anı Toplama
          </motion.p>

          <h1 className="mt-6 font-heading text-5xl leading-[1.05] font-bold tracking-tighter break-words text-primary sm:text-7xl md:text-8xl">
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
            className="mx-auto mt-7 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Misafirleriniz düğününüzde onlarca an yakalıyor — ama çoğu size hiç ulaşmıyor.
            Artık tek tek rica etmenize gerek yok; QR kodu okutan herkesin çektiği fotoğraf
            ve videolar otomatik olarak sizde toplansın.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: ctaDelay }}
            className="mt-10 flex flex-wrap justify-center gap-3"
          >
            <Pressable>
              <Link to="/login" className={buttonVariants({ size: 'lg' })}>
                Ücretsiz Dene
              </Link>
            </Pressable>
            <Pressable>
              <a href="#nasil-calisir" className={buttonVariants({ size: 'lg', variant: 'ghost' })}>
                Nasıl Çalışır?
              </a>
            </Pressable>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: ctaDelay + 0.15 }}
            className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-2.5"
          >
            {TRUST_CHIPS.map((chip) => (
              <span
                key={chip.label}
                className="flex items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3.5 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur-md"
              >
                <chip.icon className="size-3.5 text-primary" />
                {chip.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <FadeInSection>
            <h2 className="text-center font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Misafirleriniz anları böyle paylaşacak
            </h2>
          </FadeInSection>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ staggerChildren: 0.12 }}
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {SAMPLE_GALLERY.map((photo) => (
              <motion.div
                key={photo.src}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
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
            <h2 className="text-center font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <FadeInSection>
            <h2 className="text-center font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
                    <h3 className="font-heading text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                    {feature.to && (
                      <Link
                        to={feature.to}
                        className="mt-1 text-xs font-medium text-primary hover:underline"
                      >
                        Daha fazla bilgi →
                      </Link>
                    )}
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
          <h2 className="mt-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Fiyatlandırma
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Yeni başlıyoruz — fiyatlandırmamız henüz netleşmedi. Şimdilik ücretsiz deneyip
            bize geri bildirim verebilirsiniz.
          </p>
        </FadeInSection>
      </section>

      <Footer />
    </PageTransition>
  )
}

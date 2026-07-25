import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SiteHeader } from '@/components/SiteHeader'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQS = [
  {
    question: 'Verilerim ve fotoğraflarım güvende mi?',
    answer:
      'Yüklenen her dosya sunucu tarafında gerçekten iddia edilen türde olup olmadığı kontrol edilerek doğrulanır ve sadece etkinlik sahibi, kendi hesabıyla giriş yaptığında görüntüleyebilir. Herkese açık bir galeri veya arama motoru üzerinden erişilemez. Ayrıntılar için gizlilik sayfamıza bakabilirsiniz.',
  },
  {
    question: 'Düğün Şahidim ücretsiz mi?',
    answer:
      'Şu an için tamamen ücretsiz deneyebilirsiniz. Yeni başlıyoruz ve fiyatlandırmamız henüz netleşmedi; ileride bir plan açıklarsak mevcut kullanıcılarımızı önceden bilgilendireceğiz.',
  },
  {
    question: 'Kaç misafir yükleme yapabilir?',
    answer:
      'Her etkinlik varsayılan olarak 1000 yüklemeye ve 5 GB toplam depolama alanına kadar destek verir — çoğu düğün için oldukça geniş bir sınırdır. İhtiyacınız farklıysa bize ulaşabilirsiniz.',
  },
  {
    question: 'Misafirlerin bir uygulama indirmesi gerekiyor mu?',
    answer:
      'Hayır. Misafirleriniz QR kodu telefon kamerasıyla okutur, doğrudan tarayıcıda açılan sayfadan fotoğraf/video seçip yükler. Hesap oluşturmaları veya giriş yapmaları gerekmez.',
  },
  {
    question: 'Misafirler isim yazmak zorunda mı?',
    answer:
      'Hayır, isim alanı tamamen opsiyoneldir. Misafirleriniz isim yazmadan da anonim şekilde fotoğraf/video paylaşabilir.',
  },
  {
    question: 'Hangi dosya türlerini destekliyorsunuz?',
    answer:
      'Fotoğraf için JPEG, PNG, WEBP, HEIC/HEIF (en fazla 15 MB); video için MP4, MOV, WEBM (en fazla 100 MB) desteklenir. Farklı formattaki dosyalar güvenlik amacıyla kabul edilmez.',
  },
  {
    question: 'Fotoğraflar ne kadar süre saklanıyor?',
    answer:
      'Siz etkinliğinizi veya hesabınızı silmediğiniz sürece fotoğraf ve videolar saklanmaya devam eder — otomatik bir silme süresi şu an uygulanmıyor. Bu politika ürünümüz olgunlaştıkça netleşecek ve burada güncellenecektir.',
  },
  {
    question: 'Etkinliğimi nasıl oluştururum?',
    answer:
      'E-posta adresinizle şifresiz "magic link" ile giriş yapın, panelinizden birkaç saniyede etkinlik adı ve tarihini girerek oluşturun. Size özel QR kodunuz otomatik olarak hazırlanır.',
  },
]

export function FaqPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Ana sayfa
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mt-4 font-heading text-3xl text-primary">Sıkça Sorulan Sorular</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Aradığınız cevabı bulamadıysanız{' '}
            <Link to="/iletisim" className="text-foreground hover:underline">
              bize yazabilirsiniz
            </Link>
            .
          </p>

          <Accordion className="mt-8">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger className="font-heading text-base text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  )
}

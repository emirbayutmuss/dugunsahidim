import { motion } from 'framer-motion'
import { SiteHeader } from '@/components/SiteHeader'
import { Breadcrumb } from '@/components/Breadcrumb'
import { PageTransition } from '@/components/PageTransition'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function TermsPage() {
  useDocumentMeta({
    title: 'Kullanım Koşulları - Düğün Şahidim',
    description:
      "Düğün Şahidim'i kullanırken geçerli olan temel kullanım koşullarını, etkinlik sahibi ve misafir sorumluluklarını öğrenin.",
  })

  return (
    <PageTransition className="min-h-screen bg-background">
      <SiteHeader />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl px-6 py-10"
      >
        <Breadcrumb items={[{ label: 'Kullanım Koşulları' }]} />
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Kullanım Koşulları
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Düğün Şahidim yeni başlıyor; bu metin, ürünümüz büyüdükçe ayrıntılandırılacak
          çalışan bir kullanım sözleşmesidir. Şu an ücretli bir paket satmıyoruz — ödeme
          sistemi devreye girdiğinde ayrıca bir mesafeli satış sözleşmesi yayınlayacağız.
        </p>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Hizmet nedir?</h2>
          <p className="text-sm text-muted-foreground">
            Düğün Şahidim, bir etkinlik sahibinin (siz) QR kod üzerinden misafirlerinden
            fotoğraf, video ve sesli mesaj toplayabildiği, bunları tek bir galeride
            görüntüleyip indirebildiği bir hizmettir. Misafirlerinizin yüklediği içeriğin
            barındırılması ve size sunulması dışında bir aracılık yapmayız.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Etkinlik sahibi olarak sorumluluklarınız</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Hesabınıza ait giriş bağlantısını (magic link) ve panelinizi güvende tutmak sizin sorumluluğunuzdadır.</li>
            <li>
              Etkinliğinize yüklenen içeriği moderasyon araçlarıyla (onaylama/reddetme)
              gözden geçirmek ve uygunsuz içeriği kaldırmak size aittir.
            </li>
            <li>Etkinliğinizle ilgili misafirlerinize gerekli bilgilendirmeyi yapmak (ör. fotoğraflarının toplandığını belirtmek) sizin sorumluluğunuzdadır.</li>
          </ul>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Misafir yüklemelerinden kim sorumlu?</h2>
          <p className="text-sm text-muted-foreground">
            Yüklenen her fotoğraf, video veya sesli mesajın içeriğinden, o içeriği yükleyen
            misafir sorumludur. Düğün Şahidim, yüklenen içeriği önceden denetlemez; teknik
            olarak desteklenen dosya türü ve boyutu dışında bir içerik kontrolü yapmaz.
            Etkinlik sahibi olarak, galerinizi herkese açmadan önce moderasyon araçlarıyla
            içeriği gözden geçirmenizi öneririz. Hukuka aykırı, başkalarının haklarını ihlal
            eden veya uygunsuz içerik tespit edilirse, bildirim üzerine ilgili içeriği
            kaldırma hakkımızı saklı tutarız.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Yasaklı kullanım</h2>
          <p className="text-sm text-muted-foreground">
            Hizmeti; hukuka aykırı içerik yaymak, başkalarının fikri mülkiyet haklarını ihlal
            etmek, zararlı yazılım dağıtmak veya sistemin normal işleyişini bozacak şekilde
            (ör. otomatikleştirilmiş aşırı yükleme, güvenlik açığı istismarı) kullanamazsınız.
            Bu kurallara aykırı kullanım tespit edilirse ilgili hesabı veya etkinliği askıya
            alabiliriz.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Hizmet "olduğu gibi" sunulur</h2>
          <p className="text-sm text-muted-foreground">
            Düğün Şahidim şu anda aktif geliştirme aşamasındadır ve hizmet "olduğu gibi" ve
            "mevcut haliyle" sunulmaktadır. Kesintisiz veya hatasız çalışacağına dair bir
            garanti vermiyoruz. Mümkün olan en iyi hizmeti sunmak için çalışıyoruz, ancak
            veri kaybı veya erişim kesintisi ihtimaline karşı önemli anılarınızı ayrıca
            yedeklemenizi öneririz.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Hesap ve etkinlik sonlandırma</h2>
          <p className="text-sm text-muted-foreground">
            Hesabınızı veya etkinliğinizi istediğiniz zaman silebilirsiniz; bu durumda
            ilişkili tüm içerik kalıcı olarak silinir. Bu kullanım koşullarını ihlal eden
            hesapları askıya alma veya kapatma hakkımızı saklı tutarız.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Değişiklikler</h2>
          <p className="text-sm text-muted-foreground">
            Ürünümüz geliştikçe bu koşulları güncelleyebiliriz. Önemli değişiklikleri bu
            sayfada yayınlayarak duyururuz.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">İletişim</h2>
          <p className="text-sm text-muted-foreground">
            Sorularınız için:{' '}
            <a
              href="mailto:merhaba@dugunsahidim.com"
              className="text-foreground hover:underline"
            >
              merhaba@dugunsahidim.com
            </a>
          </p>
        </section>
      </motion.div>
    </PageTransition>
  )
}

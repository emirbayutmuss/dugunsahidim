import { SiteHeader } from '@/components/SiteHeader'
import { Breadcrumb } from '@/components/Breadcrumb'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function PrivacyPage() {
  useDocumentMeta({
    title: 'Gizlilik ve KVKK - Düğün Şahidim',
    description:
      "Düğün Şahidim'de hangi kişisel verileri topladığımızı, nasıl sakladığımızı, kimlerle paylaştığımızı ve KVKK kapsamındaki haklarınızı ayrıntılı şekilde öğrenin.",
  })

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-10">
        <Breadcrumb items={[{ label: 'Gizlilik' }]} />
        <h1 className="mt-4 font-heading text-3xl text-primary">Gizlilik ve Kişisel Verilerin Korunması</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Düğün Şahidim yeni başlıyor; bu metin, ürünümüz büyüdükçe ayrıntılandırılacak
          çalışan bir aydınlatma metnidir. Şu an topladığımız verileri ve bunlarla ne
          yaptığımızı olduğu gibi anlatıyoruz.
        </p>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Hangi verileri topluyoruz?</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">Etkinlik sahibi:</strong> giriş için e-posta
              adresi (şifresiz "magic link" ile), oluşturduğunuz etkinliğin adı ve tarihi.
            </li>
            <li>
              <strong className="text-foreground">Misafir:</strong> yüklediğiniz fotoğraf/video
              dosyası, girmeyi tercih ettiğiniz isim (opsiyonel — boş bırakabilirsiniz).
            </li>
            <li>
              <strong className="text-foreground">Teknik/güvenlik amaçlı:</strong> kötüye
              kullanımı (spam yüklemeyi) önlemek için IP adresiniz, geri döndürülemeyecek
              şekilde şifrelenip (hash'lenip) kısa süreliğine saklanır — ham IP adresiniz
              hiçbir zaman veritabanımızda tutulmaz.
            </li>
          </ul>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Verileri ne için kullanıyoruz?</h2>
          <p className="text-sm text-muted-foreground">
            Etkinlik sahibinin oturum açabilmesi, misafirlerin yüklediği fotoğraf/videoların
            ilgili etkinlik galerisinde toplanabilmesi ve herkese açık yükleme sayfasının
            spam/kötüye kullanıma karşı korunması için. Verilerinizi reklam, profilleme veya
            üçüncü taraflara satış amacıyla kullanmıyoruz.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Nerede ve nasıl saklanıyor?</h2>
          <p className="text-sm text-muted-foreground">
            Tüm veriler ve yüklenen dosyalar, alt yüklenicimiz Supabase üzerinde, Avrupa
            (İrlanda/Londra bölgesi) sunucularında barındırılır. Yüklenen fotoğraf/videolar
            özeldir — yalnızca ilgili etkinliğin sahibi, kendi hesabıyla giriş yaptığında
            görüntüleyip indirebilir; herkese açık bir galeri veya arama motoru tarafından
            görülemez.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Kiminle paylaşıyoruz?</h2>
          <p className="text-sm text-muted-foreground">
            Verilerinizi altyapı sağlayıcımız Supabase dışında hiçbir üçüncü tarafla
            paylaşmıyoruz. Reklam ağlarına, analitik şirketlerine veya veri
            komisyoncularına veri satmıyor ya da aktarmıyoruz.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Ne kadar süre saklanıyor?</h2>
          <p className="text-sm text-muted-foreground">
            Etkinlik sahibi, hesabını veya etkinliğini istediği zaman silebilir; bu durumda
            ilişkili tüm fotoğraf/videolar da kalıcı olarak silinir. Otomatik bir saklama
            süresi henüz belirlemedik — bu, ürünümüz olgunlaştıkça netleşecek ve bu sayfada
            güncellenecektir.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">Haklarınız</h2>
          <p className="text-sm text-muted-foreground">
            6698 sayılı KVKK kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işleme
            amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya
            yanlış işlenmişse düzeltilmesini isteme, silinmesini/yok edilmesini talep etme ve
            bu işlemlerin ilgili taraflara bildirilmesini isteme haklarına sahipsiniz. Bu
            haklarınızı kullanmak için aşağıdaki e-posta adresinden bize ulaşabilirsiniz.
          </p>
        </section>

        <section className="mt-8 space-y-2">
          <h2 className="font-heading text-xl text-foreground">İletişim</h2>
          <p className="text-sm text-muted-foreground">
            Sorularınız veya talepleriniz için:{' '}
            <a
              href="mailto:merhaba@dugunsahidim.com"
              className="text-foreground hover:underline"
            >
              merhaba@dugunsahidim.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}

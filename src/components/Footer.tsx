import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-deep px-6 py-12 text-background/70">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center text-sm">
        <span className="font-heading text-lg font-semibold text-background">Düğün Şahidim</span>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/canli-fotograf-duvari" className="hover:text-background hover:underline">
            Canlı Fotoğraf Duvarı
          </Link>
          <Link to="/sesli-misafir-defteri" className="hover:text-background hover:underline">
            Sesli Misafir Defteri
          </Link>
          <Link to="/kurumsal" className="hover:text-background hover:underline">
            Kurumsal
          </Link>
          <Link to="/sss" className="hover:text-background hover:underline">
            SSS
          </Link>
          <Link to="/iletisim" className="hover:text-background hover:underline">
            İletişim
          </Link>
          <Link to="/gizlilik" className="hover:text-background hover:underline">
            Gizlilik
          </Link>
          <Link to="/kullanim-kosullari" className="hover:text-background hover:underline">
            Kullanım Koşulları
          </Link>
        </div>
        <p>
          Sorularınız için:{' '}
          <a href="mailto:merhaba@dugunsahidim.com" className="hover:text-background hover:underline">
            merhaba@dugunsahidim.com
          </a>
        </p>
      </div>
    </footer>
  )
}

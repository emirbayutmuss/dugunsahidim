import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'
import { Button, buttonVariants } from '@/components/ui/button'

const NAV_LINKS = [
  { to: '/kurumsal', label: 'Kurumsal' },
  { to: '/sss', label: 'SSS' },
  { to: '/iletisim', label: 'İletişim' },
]

export function SiteHeader() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border/60 bg-background/85 px-6 py-4 backdrop-blur-md">
      <Link to="/" className="font-heading text-2xl text-primary">
        Düğün Şahidim
      </Link>
      <nav className="flex items-center gap-5">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="hidden text-sm font-medium text-foreground/80 hover:text-foreground sm:inline"
          >
            {link.label}
          </Link>
        ))}

        {session ? (
          <>
            {location.pathname !== '/dashboard' && (
              <Link to="/dashboard" className={buttonVariants({ size: 'sm' })}>
                Panelim
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Çıkış Yap
            </Button>
          </>
        ) : (
          location.pathname !== '/login' && (
            <Link to="/login" className={buttonVariants({ size: 'sm' })}>
              Giriş Yap
            </Link>
          )
        )}
      </nav>
    </header>
  )
}

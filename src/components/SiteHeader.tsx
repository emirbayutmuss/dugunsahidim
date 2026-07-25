import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabaseClient'
import { Button, buttonVariants } from '@/components/ui/button'

const NAV_LINKS = [
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
    <header className="relative z-20 flex items-center justify-between px-6 py-5">
      <Link to="/" className="font-heading text-xl text-primary">
        Düğün Şahidim
      </Link>
      <nav className="flex items-center gap-4">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
          >
            {link.label}
          </Link>
        ))}

        {session ? (
          <>
            {location.pathname !== '/dashboard' && (
              <Link to="/dashboard" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                Panelim
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Çıkış Yap
            </Button>
          </>
        ) : (
          <Link to="/login" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Giriş Yap
          </Link>
        )}
      </nav>
    </header>
  )
}

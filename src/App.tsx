import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { TermsPage } from '@/pages/TermsPage'
import { CanliFotografDuvariPage } from '@/pages/CanliFotografDuvariPage'
import { SesliMisafirDefteriPage } from '@/pages/SesliMisafirDefteriPage'
import { CorporatePage } from '@/pages/CorporatePage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactPage } from '@/pages/ContactPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { GuestLandingPage } from '@/pages/GuestLandingPage'
import { LiveWallPage } from '@/pages/LiveWallPage'
import { GalleryDownloadPage } from '@/pages/GalleryDownloadPage'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/gizlilik" element={<PrivacyPage />} />
        <Route path="/kullanim-kosullari" element={<TermsPage />} />
        <Route path="/canli-fotograf-duvari" element={<CanliFotografDuvariPage />} />
        <Route path="/sesli-misafir-defteri" element={<SesliMisafirDefteriPage />} />
        <Route path="/kurumsal" element={<CorporatePage />} />
        <Route path="/sss" element={<FaqPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/e/:slug" element={<GuestLandingPage />} />
        <Route path="/duvar/:token" element={<LiveWallPage />} />
        <Route path="/indir/:token" element={<GalleryDownloadPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/e/:eventId" element={<EventDetailPage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App

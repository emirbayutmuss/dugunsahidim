import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { FaqPage } from '@/pages/FaqPage'
import { ContactPage } from '@/pages/ContactPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { GuestLandingPage } from '@/pages/GuestLandingPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/gizlilik" element={<PrivacyPage />} />
      <Route path="/sss" element={<FaqPage />} />
      <Route path="/iletisim" element={<ContactPage />} />
      <Route path="/e/:slug" element={<GuestLandingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/e/:eventId" element={<EventDetailPage />} />
      </Route>
    </Routes>
  )
}

export default App

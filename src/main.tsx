import { type ReactNode, Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { DashboardProvider } from '@/context/DashboardContext'
import { LeadsProvider } from '@/context/LeadsContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import App from './App'
import { MainScreen } from '@/components/dashboard/MainScreen'
import { OverviewGuard } from '@/components/dashboard/OverviewGuard'
import { CityPage } from '@/components/city/CityPage'
import { CityMailingsPage } from '@/components/city/CityMailingsPage'
import { SupremeOwnerDashboardPage } from '@/components/owner/SupremeOwnerDashboardPage'
import { ProductPage } from '@/components/product/ProductPage'
import { SettingsPage } from '@/components/settings/SettingsPage'
import { LeadsAdminPage } from '@/components/leads/LeadsAdminPage'
import { LeadsPokerPage } from '@/components/leads/LeadsPokerPage'
import { RuntimeErrorBoundary } from '@/components/common/RuntimeErrorBoundary'
import { AgencyOnboarding } from '@/components/onboarding/AgencyOnboarding'
import { LoginPage } from '@/components/auth/LoginPage'
import { LMSPage } from '@/components/lms/LMSPage'
import { PersonnelPage } from '@/components/personnel/PersonnelPage'
import { MyPropertiesPage } from '@/components/management/my-properties/MyPropertiesPage'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/500.css'
import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'
import './index.css'

/** Защищённый маршрут — редиректит на корневой вход если нет авторизации */
function RequireAuth() {
  const { currentUser } = useAuth()
  // Используем Navigate для редиректа — useNavigate недоступен вне Router
  if (!currentUser) return <Navigate to="/" replace />
  return <Outlet />
}

function EntryRoute() {
  const { currentUser } = useAuth()

  if (currentUser) return <Navigate to="/dashboard" replace />

  return <LoginPage />
}

class RootErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('RootErrorBoundary:', error)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 560 }}>
          <h2 style={{ color: '#b91c1c' }}>Ошибка загрузки приложения</h2>
          <p style={{ marginTop: 8, color: '#374151' }}>{this.state.error.message}</p>
          <p style={{ marginTop: 16, fontSize: 14, color: '#6b7280' }}>
            Откройте консоль браузера (F12 → Console), чтобы увидеть подробности.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

function PublicLayout() {
  return <Outlet />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <AuthProvider>
        <DashboardProvider>
          <LeadsProvider>
            <HashRouter>
              <Routes>
                {/* Public routes — without sidebar */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<EntryRoute />} />
                  <Route path="/login" element={<EntryRoute />} />
                  <Route path="/register" element={<AgencyOnboarding />} />
                  <Route path="/register/agency" element={<AgencyOnboarding />} />
                </Route>

                {/* Protected dashboard routes — require auth */}
                <Route element={<RequireAuth />}>
                  <Route path="/dashboard" element={<App />}>
                    <Route index element={<MainScreen />} />
                    <Route path="overview" element={<OverviewGuard />} />
                    <Route
                      path="product"
                      element={
                        <RuntimeErrorBoundary>
                          <ProductPage />
                        </RuntimeErrorBoundary>
                      }
                    />
                    <Route path="personnel" element={<PersonnelPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="city/:cityId" element={<CityPage />} />
                    <Route path="city/:cityId/mailings" element={<CityMailingsPage />} />
                    <Route
                      path="city/:cityId/partner"
                      element={
                        <RuntimeErrorBoundary>
                          <SupremeOwnerDashboardPage />
                        </RuntimeErrorBoundary>
                      }
                    />
                    <Route
                      path="city/:cityId/partner/:partnerId"
                      element={
                        <RuntimeErrorBoundary>
                          <SupremeOwnerDashboardPage />
                        </RuntimeErrorBoundary>
                      }
                    />
                    <Route
                      path="leads"
                      element={
                        <RuntimeErrorBoundary>
                          <LeadsAdminPage />
                        </RuntimeErrorBoundary>
                      }
                    />
                    <Route
                      path="leads/poker"
                      element={
                        <RuntimeErrorBoundary>
                          <LeadsPokerPage />
                        </RuntimeErrorBoundary>
                      }
                    />
                    <Route path="leads/analytics" element={<Navigate to="/dashboard/leads" replace />} />
                    <Route path="lms" element={<LMSPage />} />
                    <Route path="my-properties" element={<MyPropertiesPage />} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </HashRouter>
          </LeadsProvider>
        </DashboardProvider>
      </AuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
)

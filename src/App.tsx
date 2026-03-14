import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import '@/components/leads/leads-secret-table.css'

export default function App() {
  const location = useLocation()
  const { currentUser } = useAuth()
  const isLeads =
    location.pathname === '/dashboard/leads' || location.pathname.startsWith('/dashboard/leads/')
  const isPokerFullscreen = location.pathname === '/dashboard/leads/poker'
  const isMainScreen =
    location.pathname === '/dashboard' || location.pathname === '/dashboard/'
  const isPersonnel = location.pathname === '/dashboard/personnel'
  const isProduct = location.pathname === '/dashboard/product'
  const isLMS = location.pathname === '/dashboard/lms'
  const isSettings = location.pathname === '/dashboard/settings'
  const isMyProperties = location.pathname.startsWith('/dashboard/my-properties')
  const isAnalyticsNetwork = location.pathname.includes('/partner')
  const useFeltStyle =
    isLeads || currentUser?.accountType === 'internal' || isMainScreen || isPersonnel || isProduct || isLMS || isSettings || isMyProperties || isAnalyticsNetwork

  return (
    <div
      className={cn(
        'flex min-h-screen',
        useFeltStyle ? 'app-theme-felt' : 'bg-background text-foreground',
      )}
    >
      <Sidebar useFeltStyle={useFeltStyle} />
      <main className={cn('flex-1 overflow-auto', isPokerFullscreen ? 'p-0 overflow-hidden' : 'p-6 lg:p-8')}>
        <Outlet />
      </main>
    </div>
  )
}

import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import '@/components/leads/leads-secret-table.css'

export default function App() {
  const { isFeltStyle } = useTheme()
  const location = useLocation()
  const isPokerFullscreen = location.pathname === '/dashboard/leads/poker'
  const isMainDashboard = location.pathname === '/dashboard' || location.pathname === '/dashboard/'

  return (
    <div
      className={cn(
        'flex min-h-screen',
        isFeltStyle ? 'app-theme-felt' : 'bg-background text-foreground',
      )}
    >
      <Sidebar useFeltStyle={isFeltStyle} />
      <main className={cn(
        'flex-1 overflow-auto',
        isPokerFullscreen ? 'p-0 overflow-hidden' :
        isMainDashboard ? 'p-0 flex flex-col' :
        'p-6 lg:p-8'
      )}>
        <Outlet />
      </main>
    </div>
  )
}

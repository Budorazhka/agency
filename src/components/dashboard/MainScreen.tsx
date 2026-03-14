import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Users,
  GraduationCap,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getDashboardBlocks } from '@/config/dashboard-blocks'
import type { DashboardBlockConfig, GemColor } from '@/config/dashboard-blocks'
import { cn } from '@/lib/utils'
import productHouseCrown from '@/assets/product-house-crown.png'
import personnelEmblem from '@/assets/personnel-emblem.png'
import leadsRoulette from '@/assets/leads-roulette.png'
import settingsGears from '@/assets/settings-gears.png'
import trainingBookCards from '@/assets/training-book-cards.png'

const ICON_MAP: Record<DashboardBlockConfig['icon'], LucideIcon> = {
  LayoutDashboard,
  Package,
  Users,
  GraduationCap,
  Settings,
}

const GEM_STYLES: Record<GemColor, string> = {
  ruby: 'luxury-gem-ruby',
  sapphire: 'luxury-gem-sapphire',
  emerald: 'luxury-gem-emerald',
  topaz: 'luxury-gem-topaz',
  opal: 'luxury-gem-opal',
  amethyst: 'luxury-gem-amethyst',
}

function SectionCard({ block }: { block: DashboardBlockConfig }) {
  const navigate = useNavigate()
  const Icon = ICON_MAP[block.icon]
  const subtitle = block.luxurySubtitle ?? block.description ?? ''
  const gemClass = block.gemColor ? GEM_STYLES[block.gemColor] : 'luxury-gem-opal'
  const isProduct = block.id === 'product'
  const isPersonnel = block.id === 'personnel'
  const isLeads = block.id === 'leads'
  const isSettings = block.id === 'settings'
  const isTraining = block.id === 'training'

  return (
    <button
      type="button"
      onClick={() => navigate(block.route)}
      className="luxury-section-card"
    >
      <span className="luxury-card-icon-wrap">
        {isProduct ? (
          <img src={productHouseCrown} alt="" className="luxury-card-image" />
        ) : isPersonnel ? (
          <img src={personnelEmblem} alt="" className="luxury-card-image" />
        ) : isLeads ? (
          <img src={leadsRoulette} alt="" className="luxury-card-image" />
        ) : isSettings ? (
          <img src={settingsGears} alt="" className="luxury-card-image" />
        ) : isTraining ? (
          <img src={trainingBookCards} alt="" className="luxury-card-image" />
        ) : (
          <Icon className="luxury-card-icon" strokeWidth={1.6} />
        )}
      </span>
      <p className="luxury-card-title">{block.label}</p>
      {subtitle && <p className="luxury-card-subtitle">{subtitle}</p>}
      <div className="luxury-chip-wrap">
        <span className={cn('luxury-chip', gemClass)} />
      </div>
      <span className="luxury-card-action">Открыть</span>
    </button>
  )
}

export function MainScreen() {
  const { currentUser } = useAuth()
  const accountType = currentUser?.accountType ?? 'agency'
  const blocks = getDashboardBlocks(accountType)

  return (
    <div className="luxury-main-wrap">
      <div className="luxury-main-inner">
        <div className="luxury-main-glow luxury-main-glow-tl" aria-hidden />
        <div className="luxury-main-glow luxury-main-glow-br" aria-hidden />

        <header className="luxury-main-header">
          <span className="luxury-main-bread">РАЗДЕЛЫ</span>
          <span className="luxury-main-bread-sep">/</span>
          <span className="luxury-main-bread-current">Главный экран</span>
        </header>

        <div className="luxury-cards-grid">
          {blocks.map((block) => (
            <SectionCard key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { BarChart2, Building2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SupremeOwnerDashboardPage } from '@/components/owner/SupremeOwnerDashboardPage'
import { useRolePermissions } from '@/hooks/useRolePermissions'
import { useNavigate } from 'react-router-dom'
import '@/components/leads/leads-secret-table.css'

type ProductSection = 'network' | null

export function ProductPage() {
  const [section, setSection] = useState<ProductSection>(null)
  const { isRopOrAbove } = useRolePermissions()
  const navigate = useNavigate()

  if (section === 'network') {
    return (
      <div className="leads-page-root -m-6 min-h-[calc(100vh+3rem)] lg:-m-8 lg:min-h-[calc(100vh+4rem)]">
        <div className="leads-page-bg" aria-hidden />
        <div className="leads-page-ornament" aria-hidden />
        <div className="leads-page relative z-10 p-6 lg:p-8 space-y-4">
          {/* Breadcrumb back */}
          <div className="flex items-center gap-2 text-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSection(null)}
              className="gap-2 text-[rgba(242,207,141,0.7)] hover:text-[#fcecc8] hover:bg-transparent px-0"
            >
              <ArrowLeft className="size-4" />
              Продукт
            </Button>
            <span className="text-[rgba(242,207,141,0.3)]">/</span>
            <span className="text-[rgba(242,207,141,0.85)] font-medium">Аналитика сети</span>
          </div>
          {/* Analytics in white container so its CSS vars render correctly */}
          <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
            <SupremeOwnerDashboardPage />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="leads-page-root -m-6 min-h-[calc(100vh+3rem)] lg:-m-8 lg:min-h-[calc(100vh+4rem)]">
      <div className="leads-page-bg" aria-hidden />
      <div className="leads-page-ornament" aria-hidden />
      <div className="leads-page relative z-10 space-y-10 p-6 lg:p-8">

        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[rgba(242,207,141,0.45)] mb-1">Панель управления</p>
          <h1 className="text-3xl font-bold text-[#fcecc8]">Продукт</h1>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 max-w-2xl">

          {/* Аналитика сети */}
          <button
            onClick={() => isRopOrAbove && setSection('network')}
            disabled={!isRopOrAbove}
            className="group relative rounded-2xl border border-[rgba(242,207,141,0.28)] bg-[rgba(18,48,36,0.7)] p-6 text-left transition-all hover:border-[rgba(242,207,141,0.55)] hover:bg-[rgba(242,207,141,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-[rgba(242,207,141,0.2)] bg-[rgba(242,207,141,0.08)]">
              <BarChart2 className="size-6 text-[rgba(242,207,141,0.85)]" />
            </div>
            <h3 className="text-base font-bold text-[#fcecc8]">Аналитика сети</h3>
            <p className="mt-1.5 text-sm text-[rgba(242,207,141,0.5)]">
              KPI, партнёры, воронка и активность
            </p>
            <div className="mt-5 text-xs font-semibold text-[rgba(242,207,141,0.55)] group-hover:text-[#fcecc8] transition-colors">
              Открыть →
            </div>
          </button>

          {/* Объекты */}
          <button
            onClick={() => navigate('/dashboard/my-properties')}
            className="group relative rounded-2xl border border-[rgba(242,207,141,0.28)] bg-[rgba(18,48,36,0.7)] p-6 text-left transition-all hover:border-[rgba(242,207,141,0.55)] hover:bg-[rgba(242,207,141,0.08)]"
          >
            <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-[rgba(242,207,141,0.2)] bg-[rgba(242,207,141,0.08)]">
              <Building2 className="size-6 text-[rgba(242,207,141,0.85)]" />
            </div>
            <h3 className="text-base font-bold text-[#fcecc8]">Объекты</h3>
            <p className="mt-1.5 text-sm text-[rgba(242,207,141,0.5)]">
              Управление объектами и витриной
            </p>
            <div className="mt-5 text-xs font-semibold text-[rgba(242,207,141,0.55)] group-hover:text-[#fcecc8] transition-colors">
              Открыть →
            </div>
          </button>

        </div>
      </div>
    </div>
  )
}

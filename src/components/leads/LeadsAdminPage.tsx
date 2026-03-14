import { useNavigate } from 'react-router-dom'
import { ShieldX, LayoutGrid, BarChart2, ArrowLeft, Layers, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import './leads-secret-table.css'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { LeadCloudTab } from './LeadCloudTab'
import { LeadPartnersTab } from './LeadPartnersTab'
import { LeadSourcesTab } from './LeadSourcesTab'
import { LeadAnalyticsTab } from './LeadAnalyticsTab'
import { useRolePermissions } from '@/hooks/useRolePermissions'
import { useAuth } from '@/context/AuthContext'
import { useLeads } from '@/context/LeadsContext'
import { useState } from 'react'

/** Упрощённый вид «Мои лиды» для роли Менеджер */
function ManagerLeadsView() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { state } = useLeads()
  const [showAnalytics, setShowAnalytics] = useState(false)

  const myLeads = state.leadPool.filter((l) => l.managerId === currentUser?.id)
  const overdueCount = myLeads.filter((l) => l.taskOverdue).length
  const withTaskCount = myLeads.filter((l) => l.hasTask).length
  const newCount = myLeads.filter((l) => l.stageId === 'new' || l.stageId === 'contact').length

  if (showAnalytics) {
    return (
      <div className="leads-page-root -m-6 min-h-[calc(100vh+3rem)] lg:-m-8 lg:min-h-[calc(100vh+4rem)]">
        <div className="leads-page-bg" aria-hidden />
        <div className="leads-page-ornament" aria-hidden />
        <div className="leads-page relative z-10 space-y-6 p-6 lg:p-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowAnalytics(false)}
              className="gap-2 text-[rgba(242,207,141,0.7)] hover:text-[#fcecc8] hover:bg-transparent"
            >
              <ArrowLeft className="size-4" />
              Назад
            </Button>
            <Header
              title="Моя аналитика"
              breadcrumbs={[{ label: 'Обзор', href: '/dashboard' }, { label: 'Мои лиды', href: '/dashboard/leads' }, { label: 'Аналитика' }]}
            />
          </div>
          <LeadAnalyticsTab />
        </div>
      </div>
    )
  }

  const firstName = currentUser?.name?.split(' ')[0] ?? 'Менеджер'

  return (
    <div className="leads-page-root -m-6 min-h-[calc(100vh+3rem)] lg:-m-8 lg:min-h-[calc(100vh+4rem)]">
      <div className="leads-page-bg" aria-hidden />
      <div className="leads-page-ornament" aria-hidden />
      <div className="leads-page relative z-10 space-y-8 p-6 lg:p-8">
        <Header
          title="Мои лиды"
          breadcrumbs={[{ label: 'Обзор', href: '/dashboard' }, { label: 'Мои лиды' }]}
        />

        {/* Приветствие */}
        <div>
          <h2 className="text-2xl font-bold text-[#fcecc8]">Добро пожаловать, {firstName}!</h2>
          <p className="mt-1 text-sm text-[rgba(242,207,141,0.55)]">{currentUser?.companyName} · Менеджер</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-[rgba(242,207,141,0.18)] bg-[rgba(18,45,36,0.65)] px-4 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Layers className="size-4 text-[rgba(242,207,141,0.55)]" />
              <span className="text-xs text-[rgba(242,207,141,0.55)] uppercase tracking-wide">Всего</span>
            </div>
            <p className="text-2xl font-bold text-[#fcecc8]">{myLeads.length}</p>
            <p className="text-xs text-[rgba(242,207,141,0.4)] mt-0.5">назначено на меня</p>
          </div>

          <div className="rounded-xl border border-[rgba(242,207,141,0.18)] bg-[rgba(18,45,36,0.65)] px-4 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="size-4 text-[rgba(242,207,141,0.55)]" />
              <span className="text-xs text-[rgba(242,207,141,0.55)] uppercase tracking-wide">Новые</span>
            </div>
            <p className="text-2xl font-bold text-[#fcecc8]">{newCount}</p>
            <p className="text-xs text-[rgba(242,207,141,0.4)] mt-0.5">требуют обработки</p>
          </div>

          <div className="rounded-xl border border-[rgba(242,207,141,0.18)] bg-[rgba(18,45,36,0.65)] px-4 py-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="size-4 text-[rgba(242,207,141,0.55)]" />
              <span className="text-xs text-[rgba(242,207,141,0.55)] uppercase tracking-wide">С задачами</span>
            </div>
            <p className="text-2xl font-bold text-[#fcecc8]">{withTaskCount}</p>
            <p className="text-xs text-[rgba(242,207,141,0.4)] mt-0.5">есть активные задачи</p>
          </div>

          <div className={`rounded-xl border px-4 py-4 ${overdueCount > 0 ? 'border-[rgba(239,68,68,0.35)] bg-[rgba(60,15,15,0.55)]' : 'border-[rgba(242,207,141,0.18)] bg-[rgba(18,45,36,0.65)]'}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className={`size-4 ${overdueCount > 0 ? 'text-[rgba(239,68,68,0.8)]' : 'text-[rgba(242,207,141,0.55)]'}`} />
              <span className="text-xs text-[rgba(242,207,141,0.55)] uppercase tracking-wide">Просроченные</span>
            </div>
            <p className={`text-2xl font-bold ${overdueCount > 0 ? 'text-red-400' : 'text-[#fcecc8]'}`}>{overdueCount}</p>
            <p className="text-xs text-[rgba(242,207,141,0.4)] mt-0.5">задачи с просрочкой</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
          <button
            onClick={() => navigate('/dashboard/leads/poker')}
            className="group rounded-2xl border border-[rgba(242,207,141,0.3)] bg-[rgba(18,48,36,0.7)] p-6 text-left transition-colors hover:border-[rgba(242,207,141,0.55)] hover:bg-[rgba(242,207,141,0.08)]"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-[rgba(242,207,141,0.25)] bg-[rgba(242,207,141,0.08)]">
              <LayoutGrid className="size-6 text-[rgba(242,207,141,0.85)]" />
            </div>
            <h3 className="text-base font-bold text-[#fcecc8]">Мои лиды</h3>
            <p className="mt-1 text-sm text-[rgba(242,207,141,0.5)]">
              Карточки с назначенными лидами
            </p>
            <div className="mt-4 text-xs font-semibold text-[rgba(242,207,141,0.65)] group-hover:text-[#fcecc8]">
              Открыть →
            </div>
          </button>

          <button
            onClick={() => setShowAnalytics(true)}
            className="group rounded-2xl border border-[rgba(242,207,141,0.18)] bg-[rgba(10,30,22,0.5)] p-6 text-left transition-colors hover:border-[rgba(242,207,141,0.35)] hover:bg-[rgba(242,207,141,0.06)]"
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-[rgba(242,207,141,0.18)] bg-[rgba(242,207,141,0.05)]">
              <BarChart2 className="size-6 text-[rgba(242,207,141,0.6)]" />
            </div>
            <h3 className="text-base font-bold text-[rgba(242,207,141,0.8)]">Моя аналитика</h3>
            <p className="mt-1 text-sm text-[rgba(242,207,141,0.4)]">
              Воронка, KPI и динамика по моим лидам
            </p>
            <div className="mt-4 text-xs font-semibold text-[rgba(242,207,141,0.4)] group-hover:text-[rgba(242,207,141,0.7)]">
              Открыть →
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export function LeadsAdminPage() {
  const navigate = useNavigate()
  const { isManager, isRopOrAbove, canManagePartners, canAddLeadSource } = useRolePermissions()

  // Менеджер видит только свой упрощённый вид
  if (isManager) {
    return <ManagerLeadsView />
  }

  // Если нет никакой роли — страница недоступна (фолбэк)
  if (!isRopOrAbove) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <div className="flex max-w-sm flex-col items-center gap-5 rounded-2xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
          <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <ShieldX className="size-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-slate-900">Нет доступа</h2>
            <p className="text-sm text-slate-600">
              У вас нет прав для просмотра раздела «Контроль лидов».
            </p>
          </div>
          <Button onClick={() => navigate('/')} variant="default" className="rounded-full px-6">
            На главную
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="leads-page-root -m-6 min-h-[calc(100vh+3rem)] lg:-m-8 lg:min-h-[calc(100vh+4rem)]">
      <div className="leads-page-bg" aria-hidden />
      <div className="leads-page-ornament" aria-hidden />
      <div className="leads-page relative z-10 space-y-8 p-6 lg:p-8">
        <Header
          title="Контроль лидов"
          breadcrumbs={[{ label: 'Обзор', href: '/dashboard' }, { label: 'Контроль лидов' }]}
        />
        <Tabs defaultValue="cloud" className="w-full">
          <div className="flex flex-wrap items-center gap-3">
            <TabsList className="leads-tabs-list inline-flex h-auto rounded-full p-1">
              {/* Облако — РОП и выше */}
              <TabsTrigger value="cloud" className="leads-tabs-trigger rounded-full border-0 px-4 py-2 text-sm font-medium shadow-none transition-colors">
                Облако лидов
              </TabsTrigger>

              {/* Партнёры — только Собственник */}
              {canManagePartners && (
                <TabsTrigger value="partners" className="leads-tabs-trigger rounded-full border-0 px-4 py-2 text-sm font-medium shadow-none transition-colors">
                  Доступ к разделу
                </TabsTrigger>
              )}

              {/* Источники — Директор и выше */}
              {canAddLeadSource && (
                <TabsTrigger value="sources" className="leads-tabs-trigger rounded-full border-0 px-4 py-2 text-sm font-medium shadow-none transition-colors">
                  Источник лидов
                </TabsTrigger>
              )}

              {/* Аналитика — РОП и выше */}
              <TabsTrigger value="analytics" className="leads-tabs-trigger rounded-full border-0 px-4 py-2 text-sm font-medium shadow-none transition-colors">
                Аналитика
              </TabsTrigger>

            </TabsList>
          </div>

          <TabsContent value="cloud" className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <Button
                onClick={() => navigate('/dashboard/leads/poker')}
                variant="outline"
                className="flex items-center gap-1.5 rounded-lg border-[rgba(242,207,141,0.35)] bg-[rgba(18,48,36,0.6)] px-3 py-2 text-xs font-semibold text-[rgba(242,207,141,0.95)] hover:bg-[rgba(242,207,141,0.15)] hover:text-[#fcecc8]"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Покерный стол (полный экран)
              </Button>
            </div>
            <LeadCloudTab />
          </TabsContent>

          {canManagePartners && (
            <TabsContent value="partners" className="mt-6">
              <LeadPartnersTab />
            </TabsContent>
          )}

          {canAddLeadSource && (
            <TabsContent value="sources" className="mt-6">
              <LeadSourcesTab />
            </TabsContent>
          )}

          <TabsContent value="analytics" className="mt-6">
            <LeadAnalyticsTab />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import {
  Eye, MousePointerClick, Target, Megaphone, Plus, Pencil, Trash2,
  TrendingUp, TrendingDown, Pause, Play, Link, Copy, Check,
} from 'lucide-react'
import { useLeads } from '@/context/LeadsContext'
import { useRolePermissions } from '@/hooks/useRolePermissions'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  CHANNELS,
  INITIAL_CAMPAIGNS,
  STATUS_COLOR,
  STATUS_LABEL,
  formatDollars,
  formatDollarsCompact,
  getCampaignSummary,
} from './leadAnalyticsShared'
import type { Campaign, CampaignChannel } from './leadAnalyticsShared'

// ─── Style tokens ──────────────────────────────────────────────────────────────

const PANEL = 'rounded-2xl border border-[rgba(242,207,141,0.15)] bg-[rgba(0,0,0,0.22)] overflow-hidden'
const SECTION_LABEL = 'text-[11px] font-bold uppercase tracking-widest text-[rgba(242,207,141,0.5)]'
const MUTED = 'text-[rgba(242,207,141,0.5)]'
const FIELD = 'w-full rounded-xl border border-[rgba(242,207,141,0.2)] bg-[rgba(0,0,0,0.35)] px-4 py-3 text-sm text-[#fcecc8] placeholder:text-[rgba(242,207,141,0.3)] outline-none focus:border-[rgba(242,207,141,0.5)] transition-all'
const NUMBER_FIELD = `${FIELD} appearance-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`
const FLABEL = 'block text-xs font-semibold uppercase tracking-wide text-[rgba(242,207,141,0.55)] mb-2'

const SELECT_TRIGGER = 'h-11 rounded-xl border border-[rgba(242,207,141,0.2)] bg-[rgba(0,0,0,0.35)] text-[#fcecc8] shadow-none focus:ring-1 focus:ring-[rgba(242,207,141,0.2)] focus:border-[rgba(242,207,141,0.5)] [&>span]:text-[#fcecc8]'
const SELECT_CONTENT = 'border-[rgba(242,207,141,0.2)] bg-[rgba(9,36,28,0.98)] text-[#fcecc8] backdrop-blur-sm'

// ─── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon, trend }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; trend?: 'up' | 'down'
}) {
  return (
    <div className="rounded-2xl border border-[rgba(242,207,141,0.15)] bg-[rgba(0,0,0,0.22)] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[rgba(242,207,141,0.1)] text-[rgba(242,207,141,0.65)]">
          {icon}
        </div>
        {trend && (
          trend === 'up'
            ? <TrendingUp className="size-4 text-emerald-400" />
            : <TrendingDown className="size-4 text-red-400" />
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-[#fcecc8] tabular-nums">{value}</p>
        <p className="text-sm text-[rgba(242,207,141,0.55)] mt-1">{label}</p>
        {sub && <p className="text-xs text-[rgba(242,207,141,0.35)] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── UTM builder ───────────────────────────────────────────────────────────────

function UtmBuilder() {
  const [base, setBase] = useState('https://estate-group.ru/')
  const [src, setSrc] = useState('')
  const [med, setMed] = useState('')
  const [camp, setCamp] = useState('')
  const [copied, setCopied] = useState(false)

  const url = useMemo(() => {
    const params = new URLSearchParams()
    if (src) params.set('utm_source', src)
    if (med) params.set('utm_medium', med)
    if (camp) params.set('utm_campaign', camp)
    const q = params.toString()
    return q ? `${base.replace(/\/$/, '')}/?${q}` : base
  }, [base, src, med, camp])

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={cn(PANEL, 'p-6 space-y-5')}>
      <div className="flex items-center gap-2.5">
        <Link className="size-4 text-[rgba(242,207,141,0.55)]" />
        <p className="text-base font-semibold text-[#fcecc8]">UTM-генератор</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={FLABEL}>Базовый URL сайта</label>
          <input value={base} onChange={e => setBase(e.target.value)} placeholder="https://example.ru" className={FIELD} />
        </div>
        <div>
          <label className={FLABEL}>utm_source</label>
          <input value={src} onChange={e => setSrc(e.target.value)} placeholder="yandex, instagram, google..." className={FIELD} />
        </div>
        <div>
          <label className={FLABEL}>utm_medium</label>
          <input value={med} onChange={e => setMed(e.target.value)} placeholder="cpc, cpm, stories..." className={FIELD} />
        </div>
        <div className="sm:col-span-2">
          <label className={FLABEL}>utm_campaign</label>
          <input value={camp} onChange={e => setCamp(e.target.value)} placeholder="название-кампании" className={FIELD} />
        </div>
      </div>
      <div className="rounded-xl border border-[rgba(242,207,141,0.14)] bg-[rgba(0,0,0,0.3)] px-4 py-3 flex items-center justify-between gap-3">
        <p className="text-xs text-[rgba(242,207,141,0.65)] truncate font-mono">{url}</p>
        <button type="button" onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-[rgba(242,207,141,0.2)] px-4 py-1.5 text-xs font-medium text-[rgba(242,207,141,0.7)] hover:border-[rgba(242,207,141,0.45)] hover:text-[#fcecc8] transition-colors">
          {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      </div>
    </div>
  )
}

// ─── Campaign form dialog ──────────────────────────────────────────────────────

interface CampForm {
  name: string; channel: CampaignChannel; budget: string
  startDate: string; endDate: string
  utmSource: string; utmMedium: string; utmCampaign: string
}

function emptyForm(): CampForm {
  return { name: '', channel: 'Яндекс.Директ', budget: '', startDate: '', endDate: '', utmSource: '', utmMedium: '', utmCampaign: '' }
}

function campToForm(c: Campaign): CampForm {
  return { name: c.name, channel: c.channel, budget: String(c.budget), startDate: c.startDate, endDate: c.endDate ?? '', utmSource: c.utmSource ?? '', utmMedium: c.utmMedium ?? '', utmCampaign: c.utmCampaign ?? '' }
}

function CampaignDialog({ open, campaign, onClose, onSave }: {
  open: boolean; campaign: Campaign | null; onClose: () => void; onSave: (c: Campaign) => void
}) {
  const [form, setForm] = useState<CampForm>(emptyForm)
  const set = (k: keyof CampForm, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  useMemo(() => {
    if (open) setForm(campaign ? campToForm(campaign) : emptyForm())
  }, [open, campaign])

  const save = () => {
    if (!form.name.trim()) return
    onSave({
      id: campaign?.id ?? `ac-${Date.now()}`,
      name: form.name, channel: form.channel,
      budget: Number(form.budget) || 0,
      spent: campaign?.spent ?? 0, impressions: campaign?.impressions ?? 0,
      clicks: campaign?.clicks ?? 0, leads: campaign?.leads ?? 0,
      status: campaign?.status ?? 'active',
      startDate: form.startDate || new Date().toISOString().slice(0, 10),
      endDate: form.endDate || undefined,
      utmSource: form.utmSource || undefined, utmMedium: form.utmMedium || undefined, utmCampaign: form.utmCampaign || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent showCloseButton={false} className="max-w-lg rounded-2xl border border-[rgba(242,207,141,0.16)] bg-[linear-gradient(180deg,rgba(9,36,28,0.99),rgba(6,20,16,0.98))] p-0 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[rgba(242,207,141,0.1)] px-6 py-5">
          <h2 className="text-lg font-semibold text-[#fcecc8]">
            {campaign ? 'Редактировать кампанию' : 'Новая кампания'}
          </h2>
        </div>
        <div className="space-y-5 px-6 py-6">
          <div>
            <label className={FLABEL}>Название</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Название кампании" className={FIELD} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={FLABEL}>Канал</label>
              <Select value={form.channel} onValueChange={v => set('channel', v as CampaignChannel)}>
                <SelectTrigger className={SELECT_TRIGGER}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={SELECT_CONTENT}>
                  {CHANNELS.map(ch => (
                    <SelectItem key={ch} value={ch} className="text-[#fcecc8] focus:bg-[rgba(242,207,141,0.1)] focus:text-[#fcecc8]">{ch}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className={FLABEL}>Бюджет ($)</label>
              <input value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="100 000" type="number" className={NUMBER_FIELD} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={FLABEL}>Дата старта</label>
              <input value={form.startDate} onChange={e => set('startDate', e.target.value)} type="date" className={cn(FIELD, 'text-[#fcecc8] [color-scheme:dark]')} />
            </div>
            <div>
              <label className={FLABEL}>Дата окончания</label>
              <input value={form.endDate} onChange={e => set('endDate', e.target.value)} type="date" className={cn(FIELD, 'text-[#fcecc8] [color-scheme:dark]')} />
            </div>
          </div>
          <div className="rounded-xl border border-[rgba(242,207,141,0.12)] bg-[rgba(0,0,0,0.25)] p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(242,207,141,0.45)]">UTM-метки (необязательно)</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-[rgba(242,207,141,0.45)] mb-1.5 block">utm_source</label>
                <input value={form.utmSource} onChange={e => set('utmSource', e.target.value)} placeholder="yandex" className={cn(FIELD, 'py-2')} />
              </div>
              <div>
                <label className="text-[11px] text-[rgba(242,207,141,0.45)] mb-1.5 block">utm_medium</label>
                <input value={form.utmMedium} onChange={e => set('utmMedium', e.target.value)} placeholder="cpc" className={cn(FIELD, 'py-2')} />
              </div>
              <div>
                <label className="text-[11px] text-[rgba(242,207,141,0.45)] mb-1.5 block">utm_campaign</label>
                <input value={form.utmCampaign} onChange={e => set('utmCampaign', e.target.value)} placeholder="brand" className={cn(FIELD, 'py-2')} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-[rgba(242,207,141,0.1)] px-6 py-4">
          <button type="button" onClick={onClose}
            className="rounded-full border border-[rgba(242,207,141,0.2)] px-5 py-2.5 text-sm font-medium text-[rgba(242,207,141,0.65)] hover:border-[rgba(242,207,141,0.4)] hover:text-[#fcecc8] transition-colors">
            Отмена
          </button>
          <button type="button" onClick={save} disabled={!form.name.trim()}
            className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-40 transition-colors">
            {campaign ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export function LeadAnalyticsTab() {
  const { canViewNetworkAnalytics } = useRolePermissions()
  useLeads()

  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)

  const openCreate = () => { setEditing(null); setDialogOpen(true) }
  const openEdit = (c: Campaign) => { setEditing(c); setDialogOpen(true) }
  const handleSave = (c: Campaign) => {
    setCampaigns(prev => { const i = prev.findIndex(x => x.id === c.id); if (i >= 0) { const n = [...prev]; n[i] = c; return n } return [...prev, c] })
    setDialogOpen(false)
  }
  const handleDelete = (id: string) => setCampaigns(prev => prev.filter(c => c.id !== id))
  const toggleStatus = (id: string) => setCampaigns(prev => prev.map(c => c.id !== id ? c : { ...c, status: c.status === 'active' ? 'paused' : c.status === 'paused' ? 'active' : c.status }))

  const {
    totalImpressions,
    totalClicks,
    totalLeads,
    totalSpent,
    avgCtr,
    avgCpl,
    budgetUsedPct,
    activeCampaigns,
  } = useMemo(() => getCampaignSummary(campaigns), [campaigns])

  return (
    <div className="space-y-10">

      {/* ── KPI ── */}
      <section className="space-y-4">
        <p className={SECTION_LABEL}>Сводная статистика</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Показов по всем кампаниям" value={totalImpressions.toLocaleString('ru-RU')} sub={`${activeCampaigns} активных кампаний`} icon={<Eye className="size-5" />} trend="up" />
          <KpiCard label="Кликов" value={totalClicks.toLocaleString('ru-RU')} sub={`CTR ${avgCtr.toFixed(2)}%`} icon={<MousePointerClick className="size-5" />} trend="up" />
          <KpiCard label="Лидов с рекламы" value={totalLeads.toLocaleString('ru-RU')} sub={`CPL ${formatDollars(avgCpl)}`} icon={<Target className="size-5" />} trend="up" />
          <KpiCard label="Потрачено" value={formatDollarsCompact(totalSpent)} sub={`${budgetUsedPct}% от общего бюджета`} icon={<Megaphone className="size-5" />} />
        </div>
      </section>

      {/* ── Кампании ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={SECTION_LABEL}>Рекламные кампании</p>
            <p className={cn('mt-1 text-sm', MUTED)}>Управление, статус и показатели эффективности</p>
          </div>
          <button type="button" onClick={openCreate}
            className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-400/60 transition-colors">
            <Plus className="size-4" />
            Добавить кампанию
          </button>
        </div>

        <div className={PANEL}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(242,207,141,0.1)]">
                  {['Кампания', 'Канал', 'Показы', 'Клики', 'CTR', 'Лиды', 'CPL', 'Бюджет', 'Статус', ''].map((h, i) => (
                    <th key={i} className={cn('px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-[rgba(242,207,141,0.45)]', i >= 2 && i <= 7 ? 'text-right' : 'text-left')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(242,207,141,0.07)]">
                {campaigns.map((c) => {
                  const ctr = c.impressions > 0 ? ((c.clicks / c.impressions) * 100).toFixed(2) : '—'
                  const cpl = c.leads > 0 ? Math.round(c.spent / c.leads) : 0
                  const budgetPct = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0
                  return (
                    <tr key={c.id} className="group hover:bg-[rgba(242,207,141,0.03)] transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-[15px] font-semibold text-[#fcecc8] max-w-[200px] truncate">{c.name}</p>
                        {c.utmCampaign && <p className="text-xs text-[rgba(242,207,141,0.35)] font-mono mt-0.5">utm={c.utmCampaign}</p>}
                      </td>
                      <td className="px-5 py-4 text-sm text-[rgba(242,207,141,0.65)]">{c.channel}</td>
                      <td className="px-5 py-4 text-right text-sm tabular-nums text-[rgba(242,207,141,0.75)]">{c.impressions.toLocaleString('ru-RU')}</td>
                      <td className="px-5 py-4 text-right text-sm tabular-nums text-[rgba(242,207,141,0.75)]">{c.clicks.toLocaleString('ru-RU')}</td>
                      <td className="px-5 py-4 text-right text-sm tabular-nums text-[rgba(242,207,141,0.75)]">{ctr}%</td>
                      <td className="px-5 py-4 text-right text-base tabular-nums font-bold text-emerald-400">{c.leads}</td>
                      <td className="px-5 py-4 text-right text-sm tabular-nums text-[rgba(242,207,141,0.75)]">{cpl > 0 ? formatDollars(cpl) : '—'}</td>
                      <td className="px-5 py-4 text-right min-w-[130px]">
                        <p className="text-sm tabular-nums text-[rgba(242,207,141,0.75)]">{formatDollarsCompact(c.spent)} / {formatDollarsCompact(c.budget)}</p>
                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(242,207,141,0.1)]">
                          <div className={cn('h-full rounded-full', budgetPct > 85 ? 'bg-red-400/70' : 'bg-emerald-500/60')} style={{ width: `${Math.min(budgetPct, 100)}%` }} />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn('rounded-full border px-3 py-1 text-xs font-semibold', STATUS_COLOR[c.status])}>
                          {STATUS_LABEL[c.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {c.status !== 'ended' && (
                            <button type="button" onClick={() => toggleStatus(c.id)}
                              className="rounded-lg p-2 text-[rgba(242,207,141,0.5)] hover:text-amber-400 hover:bg-amber-900/20 transition-colors"
                              title={c.status === 'active' ? 'Пауза' : 'Возобновить'}>
                              {c.status === 'active' ? <Pause className="size-4" /> : <Play className="size-4" />}
                            </button>
                          )}
                          <button type="button" onClick={() => openEdit(c)}
                            className="rounded-lg p-2 text-[rgba(242,207,141,0.5)] hover:text-[#fcecc8] hover:bg-[rgba(242,207,141,0.08)] transition-colors">
                            <Pencil className="size-4" />
                          </button>
                          <button type="button" onClick={() => handleDelete(c.id)}
                            className="rounded-lg p-2 text-[rgba(242,207,141,0.5)] hover:text-red-400 hover:bg-red-900/15 transition-colors">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {campaigns.length === 0 && (
                  <tr><td colSpan={10} className="px-5 py-16 text-center text-[rgba(242,207,141,0.35)]">Нет кампаний — нажмите «Добавить кампанию»</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── UTM-генератор ── */}
      <section className="space-y-4">
        <p className={SECTION_LABEL}>Инструменты</p>
        <UtmBuilder />
      </section>

      {/* ── Рейтинг менеджеров — только РОП+ ── */}
      {canViewNetworkAnalytics && (
        <section className="space-y-4">
          <p className={SECTION_LABEL}>Конверсия по менеджерам</p>
          <div className={PANEL}>
            <div className="divide-y divide-[rgba(242,207,141,0.07)]">
              <div className="px-5 py-4 flex items-center gap-4">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-[rgba(242,207,141,0.1)] text-xs font-bold text-[rgba(242,207,141,0.6)]">1</span>
                <span className="text-[15px] font-semibold text-[#fcecc8]">Анна Первичкина</span>
                <span className="ml-auto text-base tabular-nums font-bold text-emerald-400">18%</span>
              </div>
              <div className="px-5 py-4 flex items-center gap-4">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-[rgba(242,207,141,0.1)] text-xs font-bold text-[rgba(242,207,141,0.6)]">2</span>
                <span className="text-[15px] font-semibold text-[#fcecc8]">Борис Вторичкин</span>
                <span className="ml-auto text-base tabular-nums font-bold text-[rgba(242,207,141,0.6)]">12%</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <CampaignDialog open={dialogOpen} campaign={editing} onClose={() => setDialogOpen(false)} onSave={handleSave} />
    </div>
  )
}

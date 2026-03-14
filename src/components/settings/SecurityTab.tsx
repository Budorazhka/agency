import { useState } from 'react'
import { Monitor, Smartphone, LogOut, ShieldCheck } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface Session {
  id: string
  device: string
  deviceType: 'desktop' | 'mobile'
  location: string
  ip: string
  lastActive: string
  current: boolean
}

const MOCK_SESSIONS: Session[] = [
  {
    id: 's1',
    device: 'Chrome · Windows 11',
    deviceType: 'desktop',
    location: 'Москва, RU',
    ip: '95.141.32.17',
    lastActive: 'Сейчас',
    current: true,
  },
  {
    id: 's2',
    device: 'Safari · iPhone 15',
    deviceType: 'mobile',
    location: 'Москва, RU',
    ip: '95.141.32.18',
    lastActive: '2 часа назад',
    current: false,
  },
  {
    id: 's3',
    device: 'Firefox · macOS',
    deviceType: 'desktop',
    location: 'Санкт-Петербург, RU',
    ip: '81.23.44.102',
    lastActive: '3 дня назад',
    current: false,
  },
]

export function SecurityTab() {
  const [sessions, setSessions] = useState(MOCK_SESSIONS)
  const [twoFa, setTwoFa] = useState(false)

  function revokeSession(id: string) {
    setSessions((prev) => prev.filter((s) => s.id === 's1' || s.id !== id))
  }

  function revokeAll() {
    setSessions((prev) => prev.filter((s) => s.current))
  }

  return (
    <div className="space-y-8 max-w-xl">
      {/* Last login */}
      <div className="rounded-xl border border-[rgba(242,207,141,0.15)] bg-[rgba(0,0,0,0.15)] p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-[rgba(242,207,141,0.45)] mb-3">
          Последний вход
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-[rgba(242,207,141,0.4)] text-xs">Дата</p>
            <p className="text-[#fcecc8] font-medium mt-0.5">14 марта 2026, 09:41</p>
          </div>
          <div>
            <p className="text-[rgba(242,207,141,0.4)] text-xs">Устройство</p>
            <p className="text-[#fcecc8] font-medium mt-0.5">Chrome · Win 11</p>
          </div>
          <div>
            <p className="text-[rgba(242,207,141,0.4)] text-xs">IP-адрес</p>
            <p className="text-[#fcecc8] font-medium mt-0.5">95.141.32.17</p>
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className="flex items-center justify-between rounded-xl border border-[rgba(242,207,141,0.15)] bg-[rgba(0,0,0,0.15)] px-5 py-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="size-5 text-[rgba(242,207,141,0.5)]" />
          <div>
            <p className="text-sm font-medium text-[#fcecc8]">Двухфакторная аутентификация</p>
            <p className="text-xs text-[rgba(242,207,141,0.4)] mt-0.5">
              Дополнительная защита аккаунта через приложение-аутентификатор
              <span className="ml-2 rounded-full border border-[rgba(242,207,141,0.2)] bg-[rgba(242,207,141,0.07)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[rgba(242,207,141,0.4)]">
                Скоро
              </span>
            </p>
          </div>
        </div>
        <Switch
          checked={twoFa}
          onCheckedChange={setTwoFa}
          disabled
          className="opacity-50"
        />
      </div>

      {/* Active sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-[rgba(242,207,141,0.55)]">
            Активные сессии
          </p>
          {sessions.length > 1 && (
            <button
              onClick={revokeAll}
              className="text-xs font-medium text-red-400/80 hover:text-red-300 transition-colors"
            >
              Завершить все, кроме текущей
            </button>
          )}
        </div>

        <div className="rounded-xl border border-[rgba(242,207,141,0.12)] overflow-hidden divide-y divide-[rgba(242,207,141,0.06)]">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-4 px-4 py-3.5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(242,207,141,0.15)] bg-[rgba(242,207,141,0.05)] text-[rgba(242,207,141,0.5)]">
                {s.deviceType === 'mobile'
                  ? <Smartphone className="size-4" />
                  : <Monitor className="size-4" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#fcecc8]">{s.device}</p>
                  {s.current && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wide">
                      Текущая
                    </span>
                  )}
                </div>
                <p className="text-xs text-[rgba(242,207,141,0.4)] mt-0.5">
                  {s.location} · {s.ip} · {s.lastActive}
                </p>
              </div>
              {!s.current && (
                <button
                  onClick={() => revokeSession(s.id)}
                  className="flex items-center gap-1 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400/70 hover:border-red-400/40 hover:text-red-300 transition-colors"
                >
                  <LogOut className="size-3.5" />
                  Завершить
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

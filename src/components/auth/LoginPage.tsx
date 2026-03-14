import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, Building2, HardHat, UserRound, Shield } from 'lucide-react'
import { useAuth, MOCK_USERS } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ROLE_LABEL, ROLE_COLOR, ACCOUNT_TYPE_LABEL } from '@/lib/permissions'
import type { AccountType, UserRole } from '@/types/auth'
import { cn } from '@/lib/utils'

const ACCOUNT_TYPES: { type: AccountType; icon: typeof Building2 }[] = [
  { type: 'agency', icon: Building2 },
  { type: 'developer', icon: HardHat },
  { type: 'realtor', icon: UserRound },
  { type: 'internal', icon: Shield },
]

const ROLES: UserRole[] = ['owner', 'director', 'rop', 'manager']

export function LoginPage() {
  const { login, enterAs } = useAuth()
  const navigate = useNavigate()
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [loginVal, setLoginVal] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleEnterAs() {
    if (selectedAccountType && selectedRole) {
      enterAs(selectedAccountType, selectedRole)
      navigate('/dashboard', { replace: true })
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const ok = login(loginVal, password)
      setLoading(false)
      if (ok) {
        navigate('/dashboard', { replace: true })
      } else {
        setError('Неверный логин или пароль')
      }
    }, 400)
  }

  function quickLogin(userLogin: string) {
    const ok = login(userLogin, '1')
    if (ok) navigate('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-200/80">
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-foreground font-bold text-xl tracking-tight">
              Baza<span className="font-normal text-muted-foreground">.sale</span>
            </span>
          </div>
          <h2 className="text-lg font-semibold text-foreground mt-6 mb-1">
            Войти по роли (демо)
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Выберите тип кабинета и роль — откроется главный экран с нужными разделами
          </p>

          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Тип кабинета
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {ACCOUNT_TYPES.map(({ type, icon: Icon }) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedAccountType(type)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-4 transition-all text-center',
                  selectedAccountType === type
                    ? 'border-[#0d3d2f] bg-[#0d3d2f]/08 text-foreground'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-600',
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className="text-xs font-medium leading-tight">
                  {ACCOUNT_TYPE_LABEL[type]}
                </span>
              </button>
            ))}
          </div>

          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            Роль
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={cn(
                  'rounded-full border-2 px-4 py-2 text-sm font-medium transition-all',
                  selectedRole === role
                    ? 'border-[#0d3d2f] bg-[#0d3d2f] text-white'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600',
                )}
              >
                {ROLE_LABEL[role]}
              </button>
            ))}
          </div>

          <Button
            type="button"
            onClick={handleEnterAs}
            disabled={!selectedAccountType || !selectedRole}
            className="w-full bg-[#0d3d2f] hover:bg-[#0a2f24] text-white"
          >
            Войти в кабинет
          </Button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 bg-slate-50/50">
        <div className="w-full max-w-sm">
          <h2 className="text-lg font-semibold text-foreground mb-1">Вход по логину</h2>
          <p className="text-sm text-muted-foreground mb-6">Логин и пароль для доступа к кабинету</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="login">Логин</Label>
              <Input
                id="login"
                autoComplete="username"
                placeholder="owner / director / rop / manager / admin"
                value={loginVal}
                onChange={(e) => setLoginVal(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPass((v) => !v)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading || !loginVal}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Вход...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Войти
                </span>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">Пароль для демо-пользователей: 1</p>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-muted-foreground mb-2">Быстрый вход:</p>
            <div className="flex flex-wrap gap-2">
              {MOCK_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => quickLogin(u.login)}
                  className={cn(
                    'text-xs px-2 py-1 rounded border font-medium transition-colors',
                    ROLE_COLOR[u.role],
                  )}
                >
                  {ROLE_LABEL[u.role]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

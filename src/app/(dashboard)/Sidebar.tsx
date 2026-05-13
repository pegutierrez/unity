'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, LogOut } from 'lucide-react'

const navItems = [
  { href: '/cuentas', label: 'Cuentas', icon: Building2 },
]

export default function Sidebar({ user }: { user: { email: string; name?: string } }) {
  const pathname = usePathname()

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : user.email[0].toUpperCase()

  return (
    <aside className="w-60 shrink-0 flex flex-col h-full bg-panel border-r border-separator">
      <div className="px-5 py-5 border-b border-separator">
        <span className="text-base font-semibold text-ink tracking-tight">Unity</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-accent/10 text-accent'
                  : 'text-ink-muted hover:bg-separator hover:text-ink'
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2 : 1.75} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-separator">
        <div className="flex items-center gap-3 px-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-accent/15 text-accent text-xs font-semibold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            {user.name && <p className="text-xs font-medium text-ink truncate">{user.name}</p>}
            <p className="text-xs text-ink-muted truncate">{user.email}</p>
          </div>
        </div>
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-ink-muted hover:bg-separator hover:text-ink transition-colors"
          >
            <LogOut size={15} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  )
}

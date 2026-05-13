'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const TABS = [
  { id: 'general', label: 'Información general' },
  { id: 'integraciones', label: 'Integraciones' },
]

export default function TabNav({ cuentaId }: { cuentaId: string }) {
  const searchParams = useSearchParams()
  const active = searchParams.get('tab') ?? 'general'

  return (
    <div className="flex border-b border-separator mb-8">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={`/cuentas/${cuentaId}?tab=${tab.id}`}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
            active === tab.id
              ? 'border-accent text-accent'
              : 'border-transparent text-ink-muted hover:text-ink'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  )
}

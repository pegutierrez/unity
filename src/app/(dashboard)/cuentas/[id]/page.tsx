import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="p-8">
      <Link
        href="/cuentas"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-6"
      >
        <ChevronLeft size={15} />
        Volver a cuentas
      </Link>

      <div className="bg-panel border border-separator rounded-lg p-12 text-center">
        <p className="text-sm text-ink-muted">Workspace de cuenta <span className="font-mono text-ink">{id}</span></p>
        <p className="text-xs text-ink-muted mt-1">Próximamente</p>
      </div>
    </div>
  )
}

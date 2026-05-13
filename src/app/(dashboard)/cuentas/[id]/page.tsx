import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: cuenta } = await supabase
    .from('cuentas')
    .select('nombre, contacto')
    .eq('id', id)
    .single()

  if (!cuenta) notFound()

  return (
    <div className="p-8">
      <Link
        href="/cuentas"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-6"
      >
        <ChevronLeft size={15} />
        Volver a cuentas
      </Link>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">{cuenta.nombre}</h1>
        <p className="text-sm text-ink-muted mt-0.5">{cuenta.contacto}</p>
      </div>

      <div className="bg-panel border border-separator rounded-lg p-12 text-center">
        <p className="text-sm text-ink-muted">El workspace de este cliente estará disponible próximamente.</p>
      </div>
    </div>
  )
}

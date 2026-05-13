'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Estado = 'activo' | 'pausado' | 'inactivo'

interface Cuenta {
  id: string
  nombre: string
  contacto: string
  plan_mensual: number
  ad_spend: number
  roi: number
  roas: number
  estado: Estado
}

function usd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function EstadoBadge({ estado }: { estado: Estado }) {
  const styles: Record<Estado, string> = {
    activo: 'bg-success/10 text-success',
    pausado: 'bg-warning/10 text-warning',
    inactivo: 'bg-separator text-ink-muted',
  }
  const labels: Record<Estado, string> = { activo: 'Activo', pausado: 'Pausado', inactivo: 'Inactivo' }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[estado]}`}>
      {labels[estado]}
    </span>
  )
}

function RoiCell({ value }: { value: number }) {
  const good = value >= 3
  return (
    <span className={`flex items-center gap-1 font-medium text-sm ${good ? 'text-success' : 'text-danger'}`}>
      {good ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {value.toFixed(1)}x
    </span>
  )
}

function initials(nombre: string) {
  return nombre.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

export default function CuentasPage() {
  const router = useRouter()
  const supabase = createClient()

  const [cuentas, setCuentas] = useState<Cuenta[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('cuentas')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setCuentas(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Cuentas</h1>
          <p className="text-sm text-ink-muted mt-0.5">
            {loading ? 'Cargando...' : `${cuentas.length} clientes`}
          </p>
        </div>
        <button
          onClick={() => router.push('/cuentas/nueva')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md transition-colors"
        >
          <Plus size={15} />
          Nueva cuenta
        </button>
      </div>

      <div className="bg-panel border border-separator rounded-lg overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-ink-muted">Cargando cuentas...</div>
        ) : cuentas.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-ink-muted">No hay cuentas aún.</p>
            <button
              onClick={() => router.push('/cuentas/nueva')}
              className="mt-3 text-sm text-accent hover:underline"
            >
              Crear la primera cuenta
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-separator">
                <th className="text-left text-xs font-medium text-ink-muted px-5 py-3">Cliente</th>
                <th className="text-right text-xs font-medium text-ink-muted px-5 py-3">Plan mensual</th>
                <th className="text-right text-xs font-medium text-ink-muted px-5 py-3">Ad spend</th>
                <th className="text-right text-xs font-medium text-ink-muted px-5 py-3">ROI</th>
                <th className="text-right text-xs font-medium text-ink-muted px-5 py-3">ROAS</th>
                <th className="text-right text-xs font-medium text-ink-muted px-5 py-3">Estado</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {cuentas.map((cuenta, i) => (
                <tr
                  key={cuenta.id}
                  onClick={() => router.push(`/cuentas/${cuenta.id}`)}
                  className={`cursor-pointer hover:bg-canvas transition-colors group ${
                    i < cuentas.length - 1 ? 'border-b border-separator' : ''
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent text-xs font-semibold flex items-center justify-center shrink-0">
                        {initials(cuenta.nombre)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{cuenta.nombre}</p>
                        <p className="text-xs text-ink-muted">{cuenta.contacto}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-ink">{usd(cuenta.plan_mensual)}</td>
                  <td className="px-5 py-4 text-right text-sm text-ink">{usd(cuenta.ad_spend)}</td>
                  <td className="px-5 py-4 text-right"><RoiCell value={cuenta.roi} /></td>
                  <td className="px-5 py-4 text-right text-sm text-ink">{cuenta.roas.toFixed(1)}x</td>
                  <td className="px-5 py-4 text-right"><EstadoBadge estado={cuenta.estado} /></td>
                  <td className="px-3 py-4 text-ink-muted group-hover:text-ink transition-colors">
                    <ChevronRight size={15} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, RefreshCw, Unplug } from 'lucide-react'

interface Integracion {
  id?: string
  plataforma: string
  status: string
  last_synced_at?: string | null
  metadata?: Record<string, unknown>
}

const PLATAFORMAS = [
  {
    id: 'shopify',
    label: 'Shopify',
    desc: 'Ventas, pedidos y productos',
    color: '#96BF48',
    available: true,
  },
  {
    id: 'meta_ads',
    label: 'Meta Ads',
    desc: 'Campañas de Facebook e Instagram',
    color: '#0081FB',
    available: false,
  },
  {
    id: 'google_ads',
    label: 'Google Ads',
    desc: 'Search, Display y YouTube',
    color: '#4285F4',
    available: false,
  },
  {
    id: 'woocommerce',
    label: 'WooCommerce',
    desc: 'Tienda en WordPress',
    color: '#7F54B3',
    available: false,
  },
  {
    id: 'klaviyo',
    label: 'Klaviyo',
    desc: 'Email marketing y retención',
    color: '#222222',
    available: false,
  },
  {
    id: 'tiktok_ads',
    label: 'TikTok Ads',
    desc: 'Campañas en TikTok',
    color: '#010101',
    available: false,
  },
]

function PlatformIcon({ id, color }: { id: string; color: string }) {
  const initials: Record<string, string> = {
    shopify: 'SH',
    meta_ads: 'MA',
    google_ads: 'GA',
    woocommerce: 'WC',
    klaviyo: 'KL',
    tiktok_ads: 'TT',
  }
  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials[id]}
    </div>
  )
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `hace ${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `hace ${hours}h`
  return `hace ${Math.floor(hours / 24)}d`
}

export default function IntegracionesTab({
  cuentaId,
  integraciones,
}: {
  cuentaId: string
  integraciones: Integracion[]
}) {
  const [connecting, setConnecting] = useState<string | null>(null)

  const statusMap = Object.fromEntries(integraciones.map((i) => [i.plataforma, i]))

  function handleConnect(plataformaId: string) {
    if (plataformaId === 'shopify') {
      window.location.href = `/cuentas/${cuentaId}/integraciones/shopify/connect`
    }
  }

  async function handleDisconnect(plataformaId: string) {
    setConnecting(plataformaId)
    const res = await fetch(`/api/integraciones/${plataformaId}/disconnect`, {
      method: 'POST',
      body: JSON.stringify({ cuenta_id: cuentaId }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) window.location.reload()
    setConnecting(null)
  }

  return (
    <div className="space-y-3">
      {PLATAFORMAS.map((plataforma) => {
        const integ = statusMap[plataforma.id]
        const connected = integ?.status === 'connected'
        const busy = connecting === plataforma.id

        return (
          <div
            key={plataforma.id}
            className="bg-panel border border-separator rounded-lg px-5 py-4 flex items-center gap-4"
          >
            <PlatformIcon id={plataforma.id} color={plataforma.color} />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ink">{plataforma.label}</p>
                {connected && (
                  <span className="inline-flex items-center gap-1 text-xs text-success">
                    <CheckCircle2 size={12} />
                    Conectado
                  </span>
                )}
                {!connected && !plataforma.available && (
                  <span className="text-xs text-ink-muted bg-separator px-1.5 py-0.5 rounded">Próximamente</span>
                )}
              </div>
              <p className="text-xs text-ink-muted mt-0.5">{plataforma.desc}</p>
              {connected && integ?.last_synced_at && (
                <p className="text-xs text-ink-muted mt-0.5">
                  Sincronizado {timeAgo(integ.last_synced_at)}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {connected ? (
                <>
                  <button
                    title="Sincronizar"
                    className="p-1.5 text-ink-muted hover:text-ink transition-colors"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    onClick={() => handleDisconnect(plataforma.id)}
                    disabled={busy}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-danger border border-danger/30 rounded-md hover:bg-danger/5 disabled:opacity-50 transition-colors"
                  >
                    <Unplug size={13} />
                    Desconectar
                  </button>
                </>
              ) : plataforma.available ? (
                <button
                  onClick={() => handleConnect(plataforma.id)}
                  disabled={busy}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-accent hover:bg-accent-hover rounded-md disabled:opacity-50 transition-colors"
                >
                  Conectar
                </button>
              ) : (
                <button disabled className="px-3 py-1.5 text-xs font-medium text-ink-muted border border-separator rounded-md opacity-50 cursor-not-allowed">
                  Conectar
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

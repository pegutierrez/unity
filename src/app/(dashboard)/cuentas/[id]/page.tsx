import { ChevronLeft, Mail, Phone, MapPin, Users, CreditCard, Puzzle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import TabNav from './TabNav'

const INTEGRACIONES_LABELS: Record<string, string> = {
  meta_ads: 'Meta Ads',
  google_ads: 'Google Ads',
  tiktok_ads: 'TikTok Ads',
  shopify: 'Shopify',
  woocommerce: 'WooCommerce',
}

function Section({ icon: Icon, title, children }: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-panel border border-separator rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={15} className="text-ink-muted" />
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-ink-muted mb-0.5">{label}</p>
      <p className="text-sm text-ink">{value}</p>
    </div>
  )
}

export default async function WorkspacePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { id } = await params
  const { tab = 'general' } = await searchParams
  const supabase = await createClient()

  const { data: cuenta } = await supabase
    .from('cuentas')
    .select('*')
    .eq('id', id)
    .single()

  if (!cuenta) notFound()

  const integraciones: string[] = cuenta.integraciones ?? []
  const colaboradores: string[] = cuenta.colaboradores ?? []

  const estadoStyles: Record<string, string> = {
    activo: 'bg-success/10 text-success',
    pausado: 'bg-warning/10 text-warning',
    inactivo: 'bg-separator text-ink-muted',
  }
  const estadoLabels: Record<string, string> = { activo: 'Activo', pausado: 'Pausado', inactivo: 'Inactivo' }

  return (
    <div className="p-8 max-w-4xl">
      <Link
        href="/cuentas"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-8"
      >
        <ChevronLeft size={15} />
        Volver a cuentas
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 text-accent text-base font-semibold flex items-center justify-center shrink-0">
            {cuenta.nombre.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-ink">{cuenta.nombre}</h1>
            <p className="text-sm text-ink-muted mt-0.5">{cuenta.nombre_dueno || cuenta.contacto}</p>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${estadoStyles[cuenta.estado] ?? estadoStyles.inactivo}`}>
          {estadoLabels[cuenta.estado] ?? 'Inactivo'}
        </span>
      </div>

      <Suspense>
        <TabNav cuentaId={id} />
      </Suspense>

      {tab === 'general' && (
        <div className="grid grid-cols-2 gap-4">
          <Section icon={Mail} title="Contacto">
            <div className="space-y-3">
              <Field label="Nombre" value={cuenta.nombre_dueno || cuenta.contacto} />
              <Field label="Correo electrónico" value={cuenta.email} />
              <Field label="WhatsApp" value={cuenta.whatsapp} />
            </div>
          </Section>

          <Section icon={MapPin} title="Ubicación">
            <div className="space-y-3">
              <Field label="País" value={cuenta.pais} />
              <Field label="Ciudad" value={cuenta.ciudad} />
              <Field label="Dirección" value={cuenta.direccion} />
            </div>
          </Section>

          <Section icon={CreditCard} title="Plan">
            <div className="space-y-3">
              <Field
                label="Plan mensual"
                value={cuenta.plan_mensual
                  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cuenta.plan_mensual)
                  : null}
              />
            </div>
          </Section>

          <Section icon={Users} title="Colaboradores">
            {colaboradores.length > 0 ? (
              <div className="space-y-2">
                {colaboradores.map((email: string) => (
                  <div key={email} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-semibold flex items-center justify-center shrink-0">
                      {email[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-ink">{email}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted">Sin colaboradores</p>
            )}
          </Section>

          <Section icon={Puzzle} title="Integraciones">
            {integraciones.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {integraciones.map((key: string) => (
                  <span key={key} className="px-2.5 py-1 bg-accent/5 text-accent text-xs font-medium rounded-md border border-accent/20">
                    {INTEGRACIONES_LABELS[key] ?? key}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted">Sin integraciones configuradas</p>
            )}
          </Section>
        </div>
      )}
    </div>
  )
}

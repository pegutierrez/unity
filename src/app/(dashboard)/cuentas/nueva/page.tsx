'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Plus, X, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const STEPS = [
  { id: 1, label: 'Negocio' },
  { id: 2, label: 'Contacto' },
  { id: 3, label: 'Colaboradores' },
  { id: 4, label: 'Plan' },
  { id: 5, label: 'Integraciones' },
]

const INTEGRACIONES = [
  { id: 'meta_ads', label: 'Meta Ads', desc: 'Facebook e Instagram Ads' },
  { id: 'google_ads', label: 'Google Ads', desc: 'Search, Display & YouTube' },
  { id: 'tiktok_ads', label: 'TikTok Ads', desc: 'Campañas en TikTok' },
  { id: 'shopify', label: 'Shopify', desc: 'Tienda en Shopify' },
  { id: 'woocommerce', label: 'WooCommerce', desc: 'Tienda en WordPress' },
]

const PAISES = [
  'Costa Rica', 'México', 'Colombia', 'Argentina', 'Chile', 'Perú',
  'Ecuador', 'Guatemala', 'Honduras', 'El Salvador', 'Nicaragua',
  'Panamá', 'Bolivia', 'Paraguay', 'Uruguay', 'Venezuela', 'España',
  'Estados Unidos', 'Otro',
]

interface FormData {
  nombre: string
  nombre_dueno: string
  email: string
  whatsapp: string
  pais: string
  ciudad: string
  direccion: string
  colaboradores: string[]
  plan_mensual: string
  integraciones: string[]
}

const initial: FormData = {
  nombre: '',
  nombre_dueno: '',
  email: '',
  whatsapp: '',
  pais: '',
  ciudad: '',
  direccion: '',
  colaboradores: [],
  plan_mensual: '',
  integraciones: [],
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
              step.id < current
                ? 'bg-accent text-white'
                : step.id === current
                ? 'bg-accent text-white ring-4 ring-accent/20'
                : 'bg-separator text-ink-muted'
            }`}>
              {step.id < current ? <Check size={13} /> : step.id}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${
              step.id === current ? 'text-ink' : 'text-ink-muted'
            }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px w-12 mx-1 mb-5 transition-colors ${
              step.id < current ? 'bg-accent' : 'bg-separator'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full px-3 py-2 text-sm bg-canvas border border-separator rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
      />
    </div>
  )
}

export default function NuevaCuentaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(initial)
  const [colabInput, setColabInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function addColab() {
    const email = colabInput.trim().toLowerCase()
    if (!email || !email.includes('@')) return
    if (form.colaboradores.includes(email)) return
    setForm((f) => ({ ...f, colaboradores: [...f.colaboradores, email] }))
    setColabInput('')
  }

  function removeColab(email: string) {
    setForm((f) => ({ ...f, colaboradores: f.colaboradores.filter((c) => c !== email) }))
  }

  function toggleIntegracion(id: string) {
    setForm((f) => ({
      ...f,
      integraciones: f.integraciones.includes(id)
        ? f.integraciones.filter((i) => i !== id)
        : [...f.integraciones, id],
    }))
  }

  function canContinue() {
    if (step === 1) return form.nombre.trim() !== ''
    if (step === 2) return form.nombre_dueno.trim() !== '' && form.email.trim() !== ''
    if (step === 3) return true
    if (step === 4) return form.plan_mensual !== '' && Number(form.plan_mensual) > 0
    return true
  }

  async function handleFinish() {
    setSaving(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase
      .from('cuentas')
      .insert({
        nombre: form.nombre,
        contacto: form.nombre_dueno,
        nombre_dueno: form.nombre_dueno,
        email: form.email,
        whatsapp: form.whatsapp,
        pais: form.pais,
        ciudad: form.ciudad,
        direccion: form.direccion,
        colaboradores: form.colaboradores,
        plan_mensual: Number(form.plan_mensual),
        integraciones: form.integraciones,
      })
      .select()
      .single()

    if (error) {
      setError('No se pudo crear la cuenta. Intenta de nuevo.')
      setSaving(false)
      return
    }

    router.push(`/cuentas/${data.id}`)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href="/cuentas"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-8"
      >
        <ChevronLeft size={15} />
        Volver a cuentas
      </Link>

      <div className="mb-8">
        <h1 className="text-xl font-semibold text-ink">Nueva cuenta</h1>
        <p className="text-sm text-ink-muted mt-0.5">Completa el perfil del cliente</p>
      </div>

      <StepIndicator current={step} />

      <div className="bg-panel border border-separator rounded-xl p-8">
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-ink mb-1">Información del negocio</h2>
              <p className="text-sm text-ink-muted">¿Cómo se llama el negocio del cliente?</p>
            </div>
            <Input
              label="Nombre del negocio"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Ej. Café Colón"
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-ink mb-1">Datos de contacto</h2>
              <p className="text-sm text-ink-muted">Información del propietario o contacto principal</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre del dueño"
                value={form.nombre_dueno}
                onChange={(e) => set('nombre_dueno', e.target.value)}
                placeholder="Nombre completo"
                autoFocus
              />
              <Input
                label="Correo electrónico"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="correo@ejemplo.com"
              />
              <Input
                label="WhatsApp"
                value={form.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value)}
                placeholder="+506 8888 8888"
              />
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">País</label>
                <select
                  value={form.pais}
                  onChange={(e) => set('pais', e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-canvas border border-separator rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
                >
                  <option value="">Seleccionar país</option>
                  {PAISES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <Input
                label="Ciudad"
                value={form.ciudad}
                onChange={(e) => set('ciudad', e.target.value)}
                placeholder="San José"
              />
              <Input
                label="Dirección"
                value={form.direccion}
                onChange={(e) => set('direccion', e.target.value)}
                placeholder="Dirección exacta"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-ink mb-1">Colaboradores</h2>
              <p className="text-sm text-ink-muted">Personas que recibirán comunicaciones de campañas</p>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                value={colabInput}
                onChange={(e) => setColabInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addColab())}
                placeholder="correo@colaborador.com"
                className="flex-1 px-3 py-2 text-sm bg-canvas border border-separator rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
                autoFocus
              />
              <button
                type="button"
                onClick={addColab}
                className="px-3 py-2 bg-accent hover:bg-accent-hover text-white rounded-md transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>
            {form.colaboradores.length > 0 ? (
              <div className="space-y-2">
                {form.colaboradores.map((email) => (
                  <div key={email} className="flex items-center justify-between px-3 py-2 bg-canvas border border-separator rounded-md">
                    <span className="text-sm text-ink">{email}</span>
                    <button onClick={() => removeColab(email)} className="text-ink-muted hover:text-danger transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted text-center py-4">No hay colaboradores aún — puedes agregar después</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-ink mb-1">Plan mensual</h2>
              <p className="text-sm text-ink-muted">¿Cuánto paga este cliente al mes?</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Monto en USD</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted">$</span>
                <input
                  type="number"
                  min="0"
                  value={form.plan_mensual}
                  onChange={(e) => set('plan_mensual', e.target.value)}
                  placeholder="0"
                  autoFocus
                  className="w-full pl-7 pr-3 py-2 text-sm bg-canvas border border-separator rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
                />
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-semibold text-ink mb-1">Integraciones</h2>
              <p className="text-sm text-ink-muted">¿Qué plataformas usa este cliente? Conectaremos los accesos luego.</p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {INTEGRACIONES.map((int) => {
                const active = form.integraciones.includes(int.id)
                return (
                  <button
                    key={int.id}
                    type="button"
                    onClick={() => toggleIntegracion(int.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors text-left ${
                      active
                        ? 'border-accent bg-accent/5 text-ink'
                        : 'border-separator bg-canvas text-ink hover:border-accent/50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium">{int.label}</p>
                      <p className="text-xs text-ink-muted">{int.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      active ? 'border-accent bg-accent' : 'border-separator'
                    }`}>
                      {active && <Check size={11} className="text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2 text-sm font-medium text-ink-muted border border-separator rounded-md hover:bg-canvas transition-colors"
            >
              Atrás
            </button>
          ) : <div />}

          {step < STEPS.length ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canContinue()}
              className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md disabled:opacity-40 transition-colors"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="px-5 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-md disabled:opacity-60 transition-colors"
            >
              {saving ? 'Guardando...' : 'Crear cuenta'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

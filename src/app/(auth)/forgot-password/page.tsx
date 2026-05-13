'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="w-full max-w-md bg-panel rounded-xl shadow-sm border border-separator p-8 text-center">
          <div className="w-11 h-11 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-ink mb-1">Correo enviado</h2>
          <p className="text-ink-muted text-sm">Revisa tu bandeja de entrada en <strong className="text-ink">{email}</strong></p>
          <Link href="/login" className="mt-6 inline-block text-accent hover:underline text-sm">
            Volver al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="w-full max-w-md bg-panel rounded-xl shadow-sm border border-separator p-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-ink">Unity</h1>
          <p className="text-ink-muted text-sm mt-1">Recupera tu contraseña</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-canvas border border-separator rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
              placeholder="tu@email.com"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md disabled:opacity-50 transition-colors"
          >
            {loading ? 'Enviando...' : 'Enviar instrucciones'}
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          <Link href="/login" className="text-accent hover:underline">
            Volver al login
          </Link>
        </p>
      </div>
    </div>
  )
}

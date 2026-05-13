'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
  }, [])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/cuentas')
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="w-full max-w-md bg-panel rounded-xl shadow-sm border border-separator p-8 text-center">
          <p className="text-sm text-ink-muted">Verificando enlace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="w-full max-w-md bg-panel rounded-xl shadow-sm border border-separator p-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-ink">Unity</h1>
          <p className="text-ink-muted text-sm mt-1">Elige tu nueva contraseña</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Nueva contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-canvas border border-separator rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Confirmar contraseña</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-canvas border border-separator rounded-md text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition"
              placeholder="Repite la contraseña"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-md disabled:opacity-50 transition-colors"
          >
            {loading ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
}

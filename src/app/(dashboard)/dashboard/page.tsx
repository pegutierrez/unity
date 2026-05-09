import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Unity</h1>
        <form action="/auth/logout" method="post">
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </form>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Bienvenido, {user.user_metadata?.full_name || user.email}</h2>
          <p className="text-gray-500 mt-1">Panel de control de Unity Ads Manager</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Cuentas activas</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Usuarios</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">1</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500">Cuentas Meta conectadas</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
          </div>
        </div>
      </main>
    </div>
  )
}

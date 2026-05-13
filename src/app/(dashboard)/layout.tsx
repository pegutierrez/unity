import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from './Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex h-full bg-canvas">
      <Sidebar user={{ email: user.email!, name: user.user_metadata?.full_name }} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

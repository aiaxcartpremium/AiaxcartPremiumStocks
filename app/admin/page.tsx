import { redirect } from 'next/navigation'
import { requireSession } from '@/lib/requireSession'
import AdminClient from './AdminClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminPage() {
  // Check session server-side
  const { supabase, session } = await requireSession()
  if (!session) redirect('/login?next=/admin')

  return <AdminClient />
}
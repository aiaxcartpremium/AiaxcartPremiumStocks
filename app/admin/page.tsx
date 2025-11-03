// app/admin/page.tsx
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { requireSession } from '@/lib/requireSession'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Define your data structure
type Row = {
  id: string
  product_key: string
  account_type: string
  quantity: number
  expires_at: string | null
}

export default async function AdminPage() {
  // Server-side session guard
  const { supabase, session } = await requireSession()
  if (!session) redirect('/login?next=/admin')

  // Render client UI
  return <AdminClient supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
                      anonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!} />
}

// -------- CLIENT SIDE COMPONENT --------
function AdminClient({ supabaseUrl, anonKey }: { supabaseUrl: string, anonKey: string }) {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient(supabaseUrl, anonKey)

  useEffect(() => {
    async function loadStocks() {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        window.location.href = '/login?next=/admin'
        return
      }

      const { data: stocks, error } = await supabase
        .from('stocks')
        .select('id, product_key, account_type, quantity, expires_at')
        .order('expires_at', { ascending: true })

      if (error) alert(error.message)
      else setRows(stocks || [])
      setLoading(false)
    }
    loadStocks()
  }, [supabase])

  if (loading) return <p className="p-6 text-center">Loading stocks…</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <table className="w-full text-sm border">
        <thead className="bg-pink-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Product Key</th>
            <th className="p-2 border">Account Type</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Expires</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="odd:bg-white even:bg-pink-50">
              <td className="p-2 border">{r.id}</td>
              <td className="p-2 border">{r.product_key}</td>
              <td className="p-2 border">{r.account_type}</td>
              <td className="p-2 border">{r.quantity}</td>
              <td className="p-2 border">{r.expires_at || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
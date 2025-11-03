'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

type Row = {
  id: string
  product_key: string
  account_type: string
  quantity: number
  expires_at: string | null
}

export default function AdminClient() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: session } = await supabase.auth.getSession()
      if (!session.session) {
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
    load()
  }, [])

  if (loading) return <p className="text-center p-8">Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <table className="w-full text-sm border rounded-lg shadow">
        <thead className="bg-pink-200 text-gray-800">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Product Key</th>
            <th className="p-2 border">Account Type</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Expires</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
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
// app/login/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSearchParams, useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function LoginInner() {
  const sp = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const next = sp.get('next') || '/'

  async function doLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      alert(error.message)
      return
    }
    router.replace(next) // go to intended page
  }

  return (
    <form onSubmit={doLogin} className="mx-auto max-w-sm p-6 rounded-2xl bg-white/70 shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
      <input className="w-full mb-3 rounded px-3 py-2 border"
             placeholder="Email" type="email"
             value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full mb-4 rounded px-3 py-2 border"
             placeholder="Password" type="password"
             value={password} onChange={e=>setPassword(e.target.value)} />
      <button disabled={loading}
              className="w-full rounded px-3 py-2 font-semibold bg-pink-400 hover:bg-pink-500 text-white">
        {loading ? 'Logging in…' : 'Login'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading…</div>}>
      <LoginInner/>
    </Suspense>
  )
}
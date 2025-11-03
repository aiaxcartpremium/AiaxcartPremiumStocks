import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function serverClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n:string)=>cookies().get(n)?.value } }
  )
}

export async function requireRole(role: 'owner'|'admin') {
  const supabase = serverClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { redirect: '/login' as const }

  const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!prof || prof.role !== role) return { redirect: '/' as const }
  return { supabase, user }
}
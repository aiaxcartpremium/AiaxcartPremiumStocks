// app/components/Header.tsx
'use client'
import { createClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Header(){
  const [authed,setAuthed]=useState(false)
  const router = useRouter()
  useEffect(()=>{ sb.auth.getSession().then(({data})=>setAuthed(!!data.session)) },[])
  async function logout(){
    await sb.auth.signOut()
    setAuthed(false)
    router.replace('/')
  }
  return (
    <div className="flex gap-3 p-4">
      <Link href="/" className="pill px-4 py-2 bg-white/70 shadow">Home</Link>
      {!authed ? (
        <Link href="/login" className="pill px-4 py-2 btn-pink">Login</Link>
      ) : (
        <button onClick={logout} className="pill px-4 py-2 btn-pink">Logout</button>
      )}
    </div>
  )
}
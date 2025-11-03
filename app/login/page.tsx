'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { useState, useEffect } from 'react'

export default function LoginPage(){
  const params = useSearchParams()
  const router = useRouter()
  const next = params.get('next') || '/'

  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const [isAuthed,setIsAuthed]=useState(false)

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setIsAuthed(!!data.session))
  },[])

  async function login(){
    try{
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if(error) throw error
      router.replace(next)
    }catch(e:any){ alert(e.message) } finally{ setLoading(false) }
  }
  async function logout(){
    await supabase.auth.signOut()
    setIsAuthed(false)
    router.replace('/')
  }

  return (<section className="card">
    <h1>{isAuthed?'Switch / Logout':'Login'}</h1>
    <label>Email</label>
    <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
    <label>Password</label>
    <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
    <div className="actions" style={{marginTop:12}}>
      <button className="btn" onClick={login} disabled={loading}>{loading?'Loading…':'Sign in'}</button>
      <button className="btn ghost" onClick={logout}>Logout</button>
      <a className="btn ghost" href="/">Back</a>
    </div>
    <p className="muted">After sign-in you’ll be redirected back to the page that required auth.</p>
  </section>)
}

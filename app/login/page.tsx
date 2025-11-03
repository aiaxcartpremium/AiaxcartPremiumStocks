'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    const u = process.env.NEXT_PUBLIC_LOGIN_EMAIL || ''
    const p = process.env.NEXT_PUBLIC_LOGIN_PASSWORD || ''
    if(u && !email) setEmail(u as any)
    if(p && !password) setPassword(p as any)
  },[])

  async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if(error){ alert(error.message); return }
    const next = new URLSearchParams(window.location.search).get('next') || '/'
    window.location.href = next
  }
  return (
    <div className="card" style={{maxWidth:520}}>
      <h2 className="h2">Login</h2>
      <form onSubmit={onSubmit}>
        <label className="label">Email</label>
        <input className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <div className="row" style={{marginTop:16}}>
          <button className="btn" disabled={loading}>{loading?'Signing in...':'Login'}</button>
          <button type="button" className="btn ghost" onClick={()=>history.back()}>Back</button>
        </div>
        <p className="helper" style={{marginTop:8}}>You’ll be redirected after login.</p>
      </form>
    </div>
  )
}
